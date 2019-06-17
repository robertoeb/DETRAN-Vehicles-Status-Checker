"use strict";

const puppeteer = require("puppeteer");
const anticaptcha = require("./AntiCaptcha");
const anticaptchaTask = new anticaptcha();
const moment = require("moment");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckVehicle {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const url =
      "https://www.detran.mg.gov.br/veiculos/situacao-do-veiculo/consulta-situacao-do-veiculo/-/exibe_dados_veiculo/";

    const gRecaptchaResponse = await anticaptchaTask.main();
    //const gRecaptchaResponse =
    // "03AOLTBLQK_7tuLJ7GSCvmyR7TC_Wt2gNjcU94hSlO1jlE6faiPS-QiDkqyRPJumspLddZaQFc3meqpeD6Oq5x4JmqJjj6QRbFdiuleTbk-I7g6V1L6-I7spMSp_bUBbOjPmWZrn-c77hHQTya745J069UfFh4KuMsfLHGOKFUrUOTES8Naf39AXaMeNglIXRBjutZwmSnYm2euSf4SRrqHot_RHhg9nei2uXPxXUPm7D90F6Wmlqd9XLSz0kvO9DY9AzJAI5CrgHtGVSF1TBXdQKFo5bnX1BnlF-xtNGNA6qanaMXamZq8SduzoBZP4qsPFD_obsprUvsIj5lom1NjACZuYz2WQlmMg";

    const chromeOptions = {
      headless: true,
      defaultViewport: null
    };

    const vehicleData = await (async function main() {
      const browser = await puppeteer.launch(chromeOptions);
      const page = await browser.newPage();
      await page.goto(url);
      await page.type(
        "input[name='data[ConsultarSituacaoVeiculo][placa]']",
        `${request.body.placa}`
      );
      await page.type(
        "input[name='data[ConsultarSituacaoVeiculo][chassi]']",
        `${request.body.chassi}`
      );

      await page.evaluate(
        `document.getElementById("g-recaptcha-response").innerHTML="${gRecaptchaResponse}";`
      );

      await page.click("button[type=submit]");

      await page.waitForSelector(".retorno-formulario");

      var vehicleDetranData = await page.evaluate(() => {
        var scrapedData = {
          textoMultasAutuacoes: document.querySelector(".com-pendencia")
            .innerText,
          placa: document.querySelector("#placa").innerText,
          placaAnterior: document.querySelector("#placa_anterior").innerText,
          municipio: document.querySelector("#municipio").innerText,
          municipioAnterior: document.querySelector("#municipio_anterior")
            .innerText,
          marca: document.querySelector("#marca").innerText,
          anoFabricacao: document.querySelector("#ano_fabricacao").innerText,
          anoModelo: document.querySelector("#ano_modelo").innerText,
          situacaoLicenciamento: document.querySelector(
            "#situacao_licenciamento"
          ).innerText,
          dataLicenciamento: document.querySelector("#data_licenciamento")
            .innerText,
          anoIPVAPago: document.querySelector("#ano_ipva").innerText,
          parcelaIPVA: document.querySelector("#parcela").innerText,
          anoSeguroPago: document.querySelector("#seguro").innerText,
          parcelaSeguro: document.querySelector("#parcela_seguro_atual")
            .innerText,
          anoAnteriorSeguroPago: document.querySelector("#seguro_anterior")
            .innerText,
          parcelaSeguroAnterior: document.querySelector(
            "#parcela_seguro_anterior"
          ).innerText,
          anoTaxaLicenciamento: document.querySelector("#taxa_licenciamento")
            .innerText
        };

        return scrapedData;
      });

      await page.close();

      return vehicleDetranData;
    })();

    const { dataLicenciamento, textoMultasAutuacoes } = vehicleData;
    const regexMultas = /(\d).multa/g.exec(textoMultasAutuacoes);
    const regexAutuacoes = /(\d).autuaç/g.exec(textoMultasAutuacoes);
    const multas = !regexMultas ? 0 : parseInt(regexMultas[1]);
    const autuacoes = !regexAutuacoes ? 0 : parseInt(regexAutuacoes[1]);
    const formatedDate = moment(dataLicenciamento, "DD/MM/YYYY").format(
      "YYYY-MM-DD"
    );

    request.body.placa_anterior = vehicleData.placaAnterior;
    request.body.multas = multas;
    request.body.autuacoes = autuacoes;
    request.body.municipio = vehicleData.municipio;
    request.body.municipio_anterior = vehicleData.municipioAnterior;
    request.body.marca = vehicleData.marca;
    request.body.ano_fabricacao = vehicleData.anoFabricacao;
    request.body.ano_modelo = vehicleData.anoModelo;
    request.body.situacao_licenciamento = vehicleData.situacaoLicenciamento;
    request.body.data_licenciamento = formatedDate;
    request.body.ano_ipva_pago = vehicleData.anoIPVAPago;
    request.body.parcela_ipva = vehicleData.parcelaIPVA;
    request.body.ano_seguro_pago = vehicleData.anoSeguroPago;
    request.body.parcela_seguro = vehicleData.parcelaSeguro;
    request.body.ano_anterior_seguro_pago = vehicleData.anoAnteriorSeguroPago;
    request.body.parcela_seguro_anterior = vehicleData.parcelaSeguroAnterior;
    request.body.ano_taxa_licenciamento = vehicleData.anoTaxaLicenciamento;

    // call next to advance the request
    await next();
  }
}

module.exports = CheckVehicle;

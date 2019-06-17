"use strict";

/** @type {import('@adonisjs/framework/src/Env')} */
const Env = use("Env");

const Anticaptcha = require("anticaptcha2");

const anticaptcha = new Anticaptcha(Env.get("ANTI_CAPTCHA_KEY"));

class AntiCaptcha {
  async main() {
    const data = {
      url: Env.get("SITE_URL"),
      sitekey: Env.get("SITE_KEY"),
      isVisible: true
    };

    const recaptcha = new Anticaptcha.NoCaptchaTask(data);

    const getTaskResult = await anticaptcha.solve(recaptcha);

    return getTaskResult.gRecaptchaResponse;
  }
}

module.exports = AntiCaptcha;

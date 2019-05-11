"use strict";

const Vehicle = use("App/Models/Vehicle");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class SelectVehicle {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(
    {
      request,
      response,
      params: { id }
    },
    next
  ) {
    const vehicle = await Vehicle.find(id);

    if (!vehicle) {
      return response.status(400).json({
        message: "Vehicle doesn't exist"
      });
    }

    request.body.vehicle = vehicle;

    // call next to advance the request
    await next();
  }
}

module.exports = SelectVehicle;

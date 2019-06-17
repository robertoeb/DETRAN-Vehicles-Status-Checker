"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});

Route.get("vehicles", "VehicleController.index");

Route.post("vehicles", "VehicleController.store").middleware(["checkVehicle"]);

Route.get("vehicles/:id", "VehicleController.show").middleware([
  "selectVehicle"
]);

Route.patch("vehicles/:id", "VehicleController.update").middleware([
  "selectVehicle"
]);

Route.delete("vehicles/:id", "VehicleController.destroy").middleware([
  "selectVehicle"
]);

Route.get("check", "CheckVehicleController.index").middleware(["checkVehicle"]);

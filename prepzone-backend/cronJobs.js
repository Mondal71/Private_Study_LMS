const cron = require("node-cron");
const {
  autoCancelUnpaidReservations,
} = require("./controllers/reservationController");

// ⏰ Run every 5 minutes (or whatever you want)
cron.schedule("*/5 * * * *", () => {
  console.log("⏱ Running Auto-Cancel Task...");
  autoCancelUnpaidReservations();
});

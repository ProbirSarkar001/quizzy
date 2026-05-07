import Elysia, { t } from "elysia";
import { PastEventService } from "./past-event.service";

export const PastEventController = new Elysia({ prefix: "/past-event" })
  .get("/by-month-day", ({ query }) => {
    return PastEventService.getByMonthDay(query.month, query.day);
  }, {
    query: t.Object({
      month: t.Optional(t.Number()),
      day: t.Optional(t.Number())
    })
  });

import Elysia, { t } from "elysia";
import { HoroscopeService } from "./horoscope.service";
import { ZodiacSign } from "@/generated/prisma/client";

export const HoroscopeController = new Elysia({ prefix: "/horoscope" })
  .get("/all-for-date", ({ query }) => {
    return HoroscopeService.getAllForDate(query.date);
  }, {
    query: t.Object({
      date: t.Optional(t.String())
    })
  });

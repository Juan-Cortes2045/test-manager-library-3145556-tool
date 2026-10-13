# test-manager-library-3145556-tool

> **Prueba técnica · Ficha ADSO 3145556** — entrega: martes 13 de octubre de 2026, 17:00 (hora Colombia).

Utilidades de *Manager Library*. Contiene el **sembrador de datos de demostración** (`seed.mjs`, T-21), que usa **solo la API**
(`data-model.md` §9: nunca SQL directo).

## Uso

Requiere Node 22 y la API levantada desde `infra`.

```bash
BASE=http://localhost:8000/api/v1 ADMIN_USERNAME=admin ADMIN_PASSWORD=... node seed.mjs
```

Crea 40 libros (en las cinco categorías), 10 socios y 15 préstamos, y muestra cuántas filas tiene el reporte de más prestados del día.

## Limitación conocida

T-21 pide además **3 préstamos vencidos**. Por la API no se pueden crear: `loaned_at` lo pone el servidor con la hora actual y el
vencimiento es a 14 días (CA-06.6); el contrato no tiene ningún endpoint para fechar préstamos en el pasado. Los vencidos aparecerán
en `/loans/overdue` cuando pasen 14 días. Se deja registrado en `docs/spec-laravel/interpretations.md` (M-06).

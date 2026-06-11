# Insurance API — Reto Integrador (Pólizas)

## Arranque local

1. Levantar infraestructura (BD + broker):

```bash
docker compose up -d
```

2. Instalar dependencias y correr API:

```bash
yarn
yarn start:dev
```

3. Swagger:
- http://localhost:3000/api/docs

4. UIs:
- PgAdmin: http://localhost:5051
- Kafka UI: http://localhost:8081

## Configuración

La app toma variables desde `.env` (incluido en este repo solo para desarrollo local):
- Postgres: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`
- Kafka: `KAFKA_BROKER`, `KAFKA_CLIENT_ID`, `KAFKA_CONSUMER_GROUP`, `KAFKA_AUDIT_CONSUMER_GROUP`

## Endpoints mínimos

- `POST   /api/customers`
- `GET    /api/customers/:id`
- `POST   /api/policies`
- `GET    /api/policies/:id`
- `GET    /api/policies/customer/:id`
- `PATCH  /api/policies/:id/status`

## Arquitectura (Hexagonal)

- `src/policies/domain`: modelos/VOs, ports, estados y excepciones de dominio
- `src/policies/application`: DTOs, builder, factories, strategies y use-cases
- `src/policies/infrastructure`: controllers, persistencia TypeORM, y adaptadores técnicos
- `src/shared/events`: port de publicación de eventos + adapter Kafka
- `src/notifications`: consumers desacoplados

## Mapa de patrones (6)

- Factory Method:
  - Port: `src/policies/domain/ports/policy-factory.port.ts`
  - Concretas: `src/policies/application/factories/*-policy.factory.ts`
  - Registro sin switch: `src/policies/policies.module.ts`
- Strategy:
  - Port: `src/policies/domain/ports/rating-strategy.port.ts`
  - Concretas: `src/policies/application/strategies/*`
  - Registro sin switch: `src/policies/policies.module.ts`
- Builder:
  - `src/policies/application/builders/policy.builder.ts`
- State:
  - Port: `src/policies/domain/ports/policy-state.port.ts`
  - Estados: `src/policies/domain/states/*`
  - Delegación desde el agregado: `src/policies/domain/models/policy.model.ts`
- Observer:
  - Port: `src/shared/events/ports/event-publisher.port.ts`
  - Publisher Kafka: `src/shared/events/infrastructure/kafka-event-publisher.ts`
  - Publicación en transición: `src/policies/application/use-cases/change-policy-status.use-case.ts`
  - Consumers: `src/notifications/application/handlers/*`
- Singleton:
  - Port: `src/policies/domain/ports/policy-number-sequencer.port.ts`
  - Implementación única (provider singleton en Nest + secuencia en Postgres): `src/policies/infrastructure/sequence/policy-number-sequencer.ts`


CREATE TABLE `categorias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`emoji` text DEFAULT '🐾' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categorias_nome_unique` ON `categorias` (`nome`);--> statement-breakpoint
CREATE TABLE `despesas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grupo_id` text NOT NULL,
	`parcela` integer DEFAULT 1 NOT NULL,
	`total_parcelas` integer DEFAULT 1 NOT NULL,
	`descricao` text NOT NULL,
	`valor_centavos` integer NOT NULL,
	`data` text NOT NULL,
	`data_pagamento` text NOT NULL,
	`categoria_id` integer NOT NULL,
	`forma` text NOT NULL,
	`cartao_id` integer,
	`pagador_id` integer,
	`pago` integer DEFAULT true NOT NULL,
	`criado_por_id` integer NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cartao_id`) REFERENCES `cartoes`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pagador_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`criado_por_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `cartoes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nome` text NOT NULL,
	`banco` text NOT NULL,
	`dia_fechamento` integer NOT NULL,
	`dia_vencimento` integer NOT NULL,
	`criado_em` text DEFAULT (datetime('now')) NOT NULL
);

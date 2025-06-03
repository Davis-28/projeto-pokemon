-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 30/11/2024 às 15:12
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `pokemon`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `batalha`
--

CREATE TABLE `batalha` (
  `id_batalha` int(11) NOT NULL,
  `date` date NOT NULL,
  `id_treinador1` int(11) NOT NULL,
  `id_treinador2` int(11) NOT NULL,
  `id_pokemon1` int(11) NOT NULL,
  `id_pokemon2` int(11) NOT NULL,
  `id_treinador_vencedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `batalha`
--

INSERT INTO `batalha` (`id_batalha`, `date`, `id_treinador1`, `id_treinador2`, `id_pokemon1`, `id_pokemon2`, `id_treinador_vencedor`) VALUES
(9, '2024-11-20', 9, 10, 12, 13, 9);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pokemon`
--

CREATE TABLE `pokemon` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `nvl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pokemon`
--

INSERT INTO `pokemon` (`id`, `nome`, `tipo`, `nvl`) VALUES
(12, 'Luan', 'Paraíba', 12),
(13, 'Julia', 'Morta de fome', 10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `treinador`
--

CREATE TABLE `treinador` (
  `id_treinador` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `idade` int(11) NOT NULL,
  `cidade` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `treinador`
--

INSERT INTO `treinador` (`id_treinador`, `nome`, `idade`, `cidade`) VALUES
(9, 'Jorge', 40, 'Del castilho'),
(10, 'Davis', 20, 'Pavuna city');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `batalha`
--
ALTER TABLE `batalha`
  ADD PRIMARY KEY (`id_batalha`),
  ADD KEY `id_treinador1` (`id_treinador1`),
  ADD KEY `id_pokemon1` (`id_pokemon1`),
  ADD KEY `id_treinador2` (`id_treinador2`),
  ADD KEY `id_pokemon2` (`id_pokemon2`),
  ADD KEY `id_treinador_vencedor` (`id_treinador_vencedor`);

--
-- Índices de tabela `pokemon`
--
ALTER TABLE `pokemon`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `treinador`
--
ALTER TABLE `treinador`
  ADD PRIMARY KEY (`id_treinador`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `batalha`
--
ALTER TABLE `batalha`
  MODIFY `id_batalha` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de tabela `pokemon`
--
ALTER TABLE `pokemon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `treinador`
--
ALTER TABLE `treinador`
  MODIFY `id_treinador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `batalha`
--
ALTER TABLE `batalha`
  ADD CONSTRAINT `batalha_ibfk_1` FOREIGN KEY (`id_treinador1`) REFERENCES `treinador` (`id_treinador`),
  ADD CONSTRAINT `batalha_ibfk_2` FOREIGN KEY (`id_pokemon1`) REFERENCES `pokemon` (`id`),
  ADD CONSTRAINT `batalha_ibfk_3` FOREIGN KEY (`id_treinador2`) REFERENCES `treinador` (`id_treinador`),
  ADD CONSTRAINT `batalha_ibfk_4` FOREIGN KEY (`id_pokemon2`) REFERENCES `pokemon` (`id`),
  ADD CONSTRAINT `batalha_ibfk_5` FOREIGN KEY (`id_treinador_vencedor`) REFERENCES `treinador` (`id_treinador`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

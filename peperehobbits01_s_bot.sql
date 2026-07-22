-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 15 mai 2026 à 17:47
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET
SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET
time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `peperehobbits01's bot`
--

-- --------------------------------------------------------

--
-- Structure de la table `ban`
--

CREATE TABLE `ban`
(
	`guild`  varchar(255)  NOT NULL,
	`user`   varchar(255)  NOT NULL,
	`author` varchar(255)  NOT NULL,
	`ban`    varchar(255)  NOT NULL,
	`reason` varchar(2000) NOT NULL,
	`date`   varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Structure de la table `kick`
--

CREATE TABLE `kick`
(
	`guild`  varchar(255)  NOT NULL,
	`user`   varchar(255)  NOT NULL,
	`author` varchar(255)  NOT NULL,
	`kick`   varchar(255)  NOT NULL,
	`reason` varchar(2000) NOT NULL,
	`date`   varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `mute`
--

CREATE TABLE `mute`
(
	`guild`  varchar(255)  NOT NULL,
	`user`   varchar(255)  NOT NULL,
	`author` varchar(255)  NOT NULL,
	`mute`   varchar(255)  NOT NULL,
	`reason` varchar(2000) NOT NULL,
	`date`   varchar(255)  NOT NULL,
	`time`   varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `note`
--

CREATE TABLE `note`
(
	`guild`  varchar(255)  NOT NULL,
	`user`   varchar(255)  NOT NULL,
	`author` varchar(255)  NOT NULL,
	`note`   varchar(255)  NOT NULL,
	`reason` varchar(2000) NOT NULL,
	`date`   varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `voicestateupdate`
--

CREATE TABLE `voicestateupdate`
(
	`user`    varchar(255) NOT NULL,
	`channel` varchar(255) NOT NULL,
	`time`    varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `warn`
--

CREATE TABLE `warn`
(
	`guild`  varchar(255)  NOT NULL,
	`user`   varchar(255)  NOT NULL,
	`author` varchar(255)  NOT NULL,
	`warn`   varchar(255)  NOT NULL,
	`reason` varchar(2000) NOT NULL,
	`date`   varchar(255)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `xp`
--

CREATE TABLE `xp`
(
	`user`  varchar(255) NOT NULL,
	`guild` varchar(255) NOT NULL,
	`xp`    varchar(255) NOT NULL,
	`level` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `ban`
--
ALTER TABLE `ban`
	ADD PRIMARY KEY (`ban`);

--
-- Index pour la table `kick`
--
ALTER TABLE `kick`
	ADD PRIMARY KEY (`kick`);

--
-- Index pour la table `mute`
--
ALTER TABLE `mute`
	ADD PRIMARY KEY (`mute`);

--
-- Index pour la table `note`
--
ALTER TABLE `note`
	ADD PRIMARY KEY (`note`);

--
-- Index pour la table `voicestateupdate`
--
ALTER TABLE `voicestateupdate`
	ADD PRIMARY KEY (`user`);

--
-- Index pour la table `warn`
--
ALTER TABLE `warn`
	ADD PRIMARY KEY (`warn`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

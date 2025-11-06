-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2025 a las 09:46:51
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `yau_municipalidad`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudadanos`
--

CREATE TABLE `ciudadanos` (
  `id` int(11) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ciudadanos`
--

INSERT INTO `ciudadanos` (`id`, `dni`, `nombre_completo`, `email`, `telefono`, `fecha_registro`) VALUES
(1, '76090160', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 03:21:28'),
(2, '74408023', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 13:43:29'),
(3, '76090170', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 13:47:12'),
(4, '76090150', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 13:52:02'),
(5, '76090120', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 14:07:26'),
(6, '76090130', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 15:33:43'),
(7, '76090140', 'Ciudadano no registrado', NULL, NULL, '2025-11-05 21:04:17'),
(8, '76090122', 'Ciudadano no registrado', NULL, NULL, '2025-11-06 00:47:19'),
(9, '76090145', 'Ciudadano no registrado', NULL, NULL, '2025-11-06 03:45:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones`
--

CREATE TABLE `notificaciones` (
  `id` int(11) NOT NULL,
  `tramite_id` int(11) NOT NULL,
  `mensaje` text NOT NULL,
  `canal` enum('email','app') DEFAULT 'app',
  `leido` tinyint(1) DEFAULT 0,
  `fecha_envio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipos_tramite`
--

CREATE TABLE `tipos_tramite` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tiempo_max_dias` int(11) DEFAULT 10 COMMENT 'Días hábiles estimados para resolución'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tipos_tramite`
--

INSERT INTO `tipos_tramite` (`id`, `nombre`, `descripcion`, `tiempo_max_dias`) VALUES
(1, 'Licencia de construcción', 'Autorización para construir o modificar vivienda', 15),
(2, 'Reclamo de servicios públicos', 'Denuncia por falta de alumbrado, agua, desagüe, etc.', 5),
(3, 'Inscripción al padrón municipal', 'Registro para acceder a programas sociales', 2),
(4, 'Permiso para comercio ambulatorio', 'Autorización para vender en vía pública o ferias', 3),
(5, 'Certificado de buen vecino', 'Constancia de conducta vecinal', 2),
(6, 'Denuncia de obras irregulares', 'Reporte de construcciones sin licencia', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tramites`
--

CREATE TABLE `tramites` (
  `id` int(11) NOT NULL,
  `ciudadano_id` int(11) NOT NULL,
  `tipo_tramite_id` int(11) NOT NULL,
  `archivo_original` varchar(255) NOT NULL COMMENT 'Nombre del archivo subido (PDF, JPG, etc.)',
  `contenido_texto` longtext NOT NULL COMMENT 'Texto extraído por OCR',
  `estado` enum('recibido','en_proceso','resuelto','rechazado') DEFAULT 'recibido',
  `observaciones` text DEFAULT NULL,
  `prioridad` enum('baja','media','alta') DEFAULT 'media',
  `fecha_ingreso` datetime DEFAULT current_timestamp(),
  `fecha_actualizacion` datetime DEFAULT NULL ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tramites`
--

INSERT INTO `tramites` (`id`, `ciudadano_id`, `tipo_tramite_id`, `archivo_original`, `contenido_texto`, `estado`, `observaciones`, `prioridad`, `fecha_ingreso`, `fecha_actualizacion`) VALUES
(1, 1, 1, 'documento-1762330886639-842840977.png', 'Cochabamba, 11 de Abril de 2016\nSeñor:\nIng. Julio Ibarra O.\nSUPERVISOR DE REDES DE GAS\nPresente.\nREF: SOLICITUD DE PLANOS “OBRAS CIVILES Y MECANICAS CONSTRUCCION RED\nSECUNDARIA AMPLIACIONES MUNICIPIOS DE PUNATA, ARANI Y SAN BENITO”\nDe mi consideración:\nPor medio de la presente solicito la descripción de los planos de manzanos del proyecto “OBRAS\nCIVILES Y MECANICAS CONSTRUCCION RED SECUNDARIA AMPLIACIONES MUNICIPIOS\nDE PUNATA, ARANI Y SAN BENITO” GCC-COL-DRCB-171-18. Para poder desempeñar mis\nfunciones correspondientes.\nAdjunto a la presente mis respaldos:\n- Correo electrónico: ing josesuarez1990 Egmail.com\n- Numero de Celular: 69471077\nSin otro en particular esperando su aceptación y comprensión me despido con las consideraciones\nde mi más alta distinción.\nResponsable de Elaboracion medición de Planos As Suit\nIng. Roger Nelson Flores Tola', 'resuelto', NULL, 'alta', '2025-11-05 03:21:28', '2025-11-06 00:45:04'),
(2, 2, 6, 'documento-1762368207703-479549019.png', 'Señor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\nREF: Solicitud de permiso para venta en el corso,\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en el corso camavalero,\npara la venta de cerveza. En los horarios de 19:00 pm. A 24:00 pm., en los\nespacios de 2 x 2 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.\nSra. Neida Terceros Calizaya\nC.1.: 7729579 S.C.', 'recibido', NULL, 'baja', '2025-11-05 13:43:29', NULL),
(3, 3, 6, 'documento-1762368432286-263473050.png', 'Santa Cruz, 06 de febrero del 2014\nSeñor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\n\nREE: Solicl , 6\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en los días del camaval,\npara la venta de cerveza. En los horarios de 14:00 pm. A 18:00 pm., en los\nespacios de 2 x 1 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.', 'rechazado', NULL, 'alta', '2025-11-05 13:47:12', '2025-11-06 00:45:09'),
(4, 4, 3, 'documento-1762368721218-694803835.png', 'Cochabamba, 01 de enero de 2018\nSeñor:\nIVÁN TELLERÍA\nALCALDE MUNICIPAL\nPresente:\n\nRef.: SOLICITUD PADRON MUNICIPAL\nOTROS.-\n\nYo, Roberto Carlos Fernandez Ibarra mayor de edad, hábil por\nderecho vecino de esta, con Cl. 12433552 Chba., presentándome a su\nautoridad con respeto digo:\n\nPara fines legales consiguientes y adjuntando la documentación\nexigida, pido a su autoridad que, por la sección correspondiente de esa\nHonorable Alcaldía Municipal se me extienda el PADRON MUNICIPAL, para\nel funcionamiento de la empresa cuya razón social es Empresa “GABICONT\nS.R.L”, con NIT No. 2132435465 ubicada en la Av. Los Angeles entre Jose\nMaria V. y Dionisio B. No. 584 en la ciudad de Cochabamba y sea previo el\ncumplimiento de las formalidades de rigor.\n\nOTROS SI.- Providencias conocere en secretaria de su despacho.\nRoberto Fernandez Ibarra Dr. Enrique Rosales\nRepresentante Legal Abogado', 'en_proceso', NULL, 'alta', '2025-11-05 13:52:02', '2025-11-06 03:42:14'),
(5, 1, 6, 'documento-1762368829517-573052082.png', 'Santa Cruz, 06 de febrero del 2014\nSeñor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\n\nREE: Solicl , 6\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en los días del camaval,\npara la venta de cerveza. En los horarios de 14:00 pm. A 18:00 pm., en los\nespacios de 2 x 1 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.', 'recibido', NULL, 'alta', '2025-11-05 13:53:50', NULL),
(6, 5, 6, 'documento-1762369645378-515421591.png', 'EA —  conorescmca\nLa ARBOLEDA DEL CAMPESTRE PAYANDE\nNT.O2TOTIS-6\nCERTIFICA\nQue el señor CRISTHIAN CAMILO ROJAS VARÓN, identificado con cédula de\nCudadaría no. 1109001675, vie en el Conpnto Residencal Aroleda de\nCampeste Payandé, apariamento 22-01, desde el 22 de ocembre de 2018\npresentando un comporaminto óneo de sae conven y respeo or sue\nVecinos, aalano a normalivad de Propead Horzonta y la de carácer general\nJa fecha. o se presenta ningún lamado de tención y observaciones negabvas\nel rojas Varo slndo un buen eso\nPortal razón la suscrita deposa su conlanza en l buen comportamiento del xñor\nCrobian Caio Rojs Verón\nLa presente se expide a sold del ntresado, a los dez (10) días del mes de\njunio dl dos mi vente (202)\nCondalmenta\nALISON ERAN Talokon OLAYA\nADMINISTRADORA\nCONJUNTO RESIDENCIAL ARBOLEDA DEL CAMPESTRE PAYANDÉ\nCall 12 2Sur 129 - Ibagué Tolima.\nConunedencalande mal ca Calar 204452059', 'recibido', NULL, 'alta', '2025-11-05 14:07:26', NULL),
(7, 1, 6, 'documento-1762370090485-604008104.png', 'Santa Cruz, 06 de febrero del 2014\nSeñor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\n\nREE: Solicl , 6\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en los días del camaval,\npara la venta de cerveza. En los horarios de 14:00 pm. A 18:00 pm., en los\nespacios de 2 x 1 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.', 'recibido', NULL, 'alta', '2025-11-05 14:14:51', NULL),
(8, 6, 4, 'documento-1762374822684-754133994.png', 'Santa Cruz, 06 de febrero del 2014\nSeñor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\n\nREE: Solicl , 6\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en los días del camaval,\npara la venta de cerveza. En los horarios de 14:00 pm. A 18:00 pm., en los\nespacios de 2 x 1 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.', 'recibido', NULL, 'baja', '2025-11-05 15:33:43', NULL),
(9, 7, 3, 'documento-1762394655851-294490339.png', 'Cochabamba, 01 de enero de 2018\nSeñor:\nIVÁN TELLERÍA\nALCALDE MUNICIPAL\nPresente:\n\nRef.: SOLICITUD PADRON MUNICIPAL\nOTROS.-\n\nYo, Roberto Carlos Fernandez Ibarra mayor de edad, hábil por\nderecho vecino de esta, con Cl. 12433552 Chba., presentándome a su\nautoridad con respeto digo:\n\nPara fines legales consiguientes y adjuntando la documentación\nexigida, pido a su autoridad que, por la sección correspondiente de esa\nHonorable Alcaldía Municipal se me extienda el PADRON MUNICIPAL, para\nel funcionamiento de la empresa cuya razón social es Empresa “GABICONT\nS.R.L”, con NIT No. 2132435465 ubicada en la Av. Los Angeles entre Jose\nMaria V. y Dionisio B. No. 584 en la ciudad de Cochabamba y sea previo el\ncumplimiento de las formalidades de rigor.\n\nOTROS SI.- Providencias conocere en secretaria de su despacho.\nRoberto Fernandez Ibarra Dr. Enrique Rosales\nRepresentante Legal Abogado', 'en_proceso', NULL, 'baja', '2025-11-05 21:04:17', '2025-11-06 01:26:14'),
(10, 8, 4, 'documento-1762408038263-599181876.png', 'Señor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\nREF: Solicitud de permiso para venta en el corso,\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en el corso camavalero,\npara la venta de cerveza. En los horarios de 19:00 pm. A 24:00 pm., en los\nespacios de 2 x 2 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.\nSra. Neida Terceros Calizaya\nC.1.: 7729579 S.C.', 'en_proceso', NULL, 'baja', '2025-11-06 00:47:19', '2025-11-06 00:48:18'),
(11, 9, 4, 'documento-1762418722392-120631156.png', 'Señor:\nLIC. JOSÉ CANUDAS ARAUJO\nOFICIAL MAYOR DE DEFENZA CIUDADANA.\nREF: Solicitud de permiso para venta en el corso,\nLie. José Canudas\nMe dirijo a usted para saludarle y desearle éxitos en las funciones que realiza y al\nmismo tiempo solicitar el permiso de un espacio público en el corso camavalero,\npara la venta de cerveza. En los horarios de 19:00 pm. A 24:00 pm., en los\nespacios de 2 x 2 metros cuadrados.\nCon este motivo, le reitero las consideraciones personales más distinguidas y me\ndespido de ante mano agradeciendo su aceptación.\nSra. Neida Terceros Calizaya\nC.1.: 7729579 S.C.', 'recibido', NULL, 'baja', '2025-11-06 03:45:23', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD KEY `idx_ciudadanos_dni` (`dni`);

--
-- Indices de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tramite_id` (`tramite_id`);

--
-- Indices de la tabla `tipos_tramite`
--
ALTER TABLE `tipos_tramite`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `tramites`
--
ALTER TABLE `tramites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ciudadano_id` (`ciudadano_id`),
  ADD KEY `tipo_tramite_id` (`tipo_tramite_id`),
  ADD KEY `idx_tramites_estado` (`estado`),
  ADD KEY `idx_tramites_prioridad` (`prioridad`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudadanos`
--
ALTER TABLE `ciudadanos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipos_tramite`
--
ALTER TABLE `tipos_tramite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tramites`
--
ALTER TABLE `tramites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `notificaciones`
--
ALTER TABLE `notificaciones`
  ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`tramite_id`) REFERENCES `tramites` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tramites`
--
ALTER TABLE `tramites`
  ADD CONSTRAINT `tramites_ibfk_1` FOREIGN KEY (`ciudadano_id`) REFERENCES `ciudadanos` (`id`),
  ADD CONSTRAINT `tramites_ibfk_2` FOREIGN KEY (`tipo_tramite_id`) REFERENCES `tipos_tramite` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

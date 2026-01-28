-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Май 26 2025 г., 14:50
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ocs`
--

-- --------------------------------------------------------

--
-- Структура таблицы `announcements`
--

CREATE TABLE `announcements` (
  `announcement_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `priority` varchar(20) DEFAULT 'normal',
  `target_role` varchar(20) DEFAULT 'all',
  `is_active` tinyint(1) DEFAULT 1,
  `category` varchar(50) DEFAULT 'general',
  `is_pinned` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `announcements`
--

INSERT INTO `announcements` (`announcement_id`, `title`, `content`, `created_by`, `created_at`, `updated_at`, `start_date`, `end_date`, `priority`, `target_role`, `is_active`, `category`, `is_pinned`) VALUES
(12, 'Welcome to the Summer Season!', 'We are excited to kick off the summer with fresh activities, games, and outdoor events. Get ready!', 19, '2025-05-21 09:07:51', NULL, '2025-06-01', '2025-06-30', 'normal', 'all', 1, 'general', 0),
(13, 'Leadership Strategy Session', 'Leaders, please attend the strategy session this Friday to discuss upcoming responsibilities and goals.', 19, '2025-05-21 09:08:17', NULL, '2025-05-24', '2025-05-24', 'high', 'leader', 1, 'general', 0),
(14, 'Helpers Workshop: Safety & Teamwork', 'A required workshop for helpers focusing on safety rules and supporting group dynamics', 19, '2025-05-21 09:08:41', NULL, '2025-05-25', '2025-05-25', 'high', 'helper', 1, 'general', 0),
(15, 'Badge Collection Updated', 'We’ve added new badges to the collection! Check the badge wall or the app to view them.', 19, '2025-05-21 09:09:19', NULL, '2025-06-06', '2025-06-15', 'low', 'all', 1, 'general', 0),
(16, 'Public Scouts Picnic Day', 'A fun picnic for all public scouts is planned in the city park. Bring your snacks and sports gear!', 19, '2025-05-21 09:10:37', NULL, '2025-06-10', '2025-06-10', 'normal', 'public', 1, 'general', 0),
(17, 'Urgent: Health Forms Needed', 'All participants must submit updated health forms by the end of this week to take part in summer activities.', 19, '2025-05-21 09:11:06', NULL, '2025-05-21', '2025-05-28', 'urgent', 'all', 1, 'general', 0),
(18, 'Night Hike for Leaders', 'Leadership-only night hike to test navigation and planning skills. Flashlights required.', 19, '2025-05-21 09:11:51', NULL, '2025-06-07', '2025-06-07', 'high', 'leader', 1, 'general', 0),
(19, 'First Aid Refresher Course', 'Optional but recommended refresher for all helpers and public scouts.', 19, '2025-05-21 09:12:18', NULL, '2025-06-12', '2025-06-12', 'normal', 'helper', 1, 'general', 0),
(20, 'Summer Camp Registration Open', 'Don’t miss out! Sign up for the summer camp before June 15th. Limited spots available.', 19, '2025-05-21 09:12:54', NULL, '2025-05-21', '2025-06-15', 'normal', 'all', 1, 'general', 0),
(21, 'Community Cleanup Initiative', 'Join us in giving back by participating in our weekend cleanup drive. Gloves and bags provided.', 19, '2025-05-21 09:13:28', NULL, '2025-06-08', '2025-06-09', 'normal', 'public', 1, 'general', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `badges`
--

CREATE TABLE `badges` (
  `badge_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `difficulty_level` int(11) DEFAULT NULL CHECK (`difficulty_level` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `badges`
--

INSERT INTO `badges` (`badge_id`, `name`, `category`, `description`, `image_url`, `difficulty_level`, `created_at`) VALUES
(12, 'Pets Badge', 'Animal Care', 'Celebrate your love for animals! Earn this badge by caring for a pet, learning about animal welfare, or volunteering at a local shelter.', '/uploads/badges/badge-1747758926150-985939917.png', 2, '2025-05-20 16:35:26'),
(13, 'Artist Badge', 'Creative Arts', 'Unleash your creativity! This badge is awarded for mastering a form of visual art, such as painting, drawing, or sculpting.', '/uploads/badges/badge-1747760064617-501046214.png', 3, '2025-05-20 16:54:24'),
(14, 'Athletics Badge', 'Sports', 'Show your strength and speed! Achieve this badge by excelling in a sport or completing a series of physical fitness challenges.', '/uploads/badges/badge-1747760142696-609309662.png', 4, '2025-05-20 16:55:42'),
(15, 'Backwoods Cooker Badge', 'Outdoor Skills', 'Master the art of outdoor cooking! Earn this badge by preparing meals over a campfire or in a wilderness setting.', '/uploads/badges/badge-1747760219950-556730936.png', 3, '2025-05-20 16:56:59'),
(16, 'Book Reader Badge', 'Literature', 'Dive into the world of stories! This badge is for avid readers who complete a set number of books or explore diverse genres.', '/uploads/badges/badge-1747760302426-728803836.png', 2, '2025-05-20 16:58:22'),
(17, 'Chef Badge', 'Culinary Arts', 'Cook up a storm! Earn this badge by mastering culinary techniques, creating recipes, or preparing a multi-course meal.', '/uploads/badges/badge-1747760372246-384016912.png', 4, '2025-05-20 16:59:32'),
(18, 'Collector Badge', 'Hobbies', 'Showcase your passion for collecting! This badge is awarded for curating a unique collection, from stamps to rare coins.', '/uploads/badges/badge-1747760447182-643025695.png', 3, '2025-05-20 17:00:47'),
(19, 'Communication System Badge', 'Technology', 'Connect the world! Achieve this badge by learning about communication technologies or mastering skills like Morse code or radio operation.', '/uploads/badges/badge-1747760519542-362609816.png', 4, '2025-05-20 17:01:59');

-- --------------------------------------------------------

--
-- Структура таблицы `badge_achievements`
--

CREATE TABLE `badge_achievements` (
  `achievement_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `badge_id` int(11) DEFAULT NULL,
  `awarded_by` int(11) DEFAULT NULL,
  `awarded_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `badge_achievements`
--

INSERT INTO `badge_achievements` (`achievement_id`, `user_id`, `badge_id`, `awarded_by`, `awarded_date`, `notes`) VALUES
(1, 5, 3, 11, '2025-05-13 15:21:50', ''),
(4, 6, 10, 11, '2025-05-13 15:22:57', ''),
(5, 5, 7, 11, '2025-05-13 21:18:13', ''),
(7, 12, 3, 19, '2025-05-16 16:20:11', NULL),
(8, 12, 9, 19, '2025-05-16 16:21:43', NULL),
(9, 17, 9, 19, '2025-05-16 16:26:12', NULL),
(10, 5, 8, 19, '2025-05-16 16:27:44', NULL),
(11, 14, 8, 19, '2025-05-16 16:30:01', NULL),
(12, 14, 7, 19, '2025-05-16 16:30:27', NULL),
(14, 17, 7, 19, '2025-05-16 16:31:54', NULL),
(15, 5, 5, 19, '2025-05-16 16:45:53', NULL),
(16, 17, 6, 19, '2025-05-16 16:56:07', NULL),
(18, 18, 7, 19, '2025-05-16 18:01:33', NULL),
(20, 18, 4, 19, '2025-05-16 18:24:37', ''),
(21, 18, 8, 19, '2025-05-16 18:28:00', 'шг'),
(22, 5, 4, 19, '2025-05-17 13:27:26', ''),
(23, 17, 14, 19, '2025-05-20 17:44:11', 'Great job '),
(24, 21, 13, 19, '2025-05-21 19:27:45', 'gg'),
(25, 21, 12, 19, '2025-05-21 19:27:57', 'gg');

-- --------------------------------------------------------

--
-- Структура таблицы `badge_achievement_evidence`
--

CREATE TABLE `badge_achievement_evidence` (
  `evidence_id` bigint(20) UNSIGNED NOT NULL,
  `progress_id` int(11) DEFAULT NULL,
  `file_url` varchar(255) NOT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `badge_achievement_progress`
--

CREATE TABLE `badge_achievement_progress` (
  `progress_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `badge_id` int(11) DEFAULT NULL,
  `requirement_id` int(11) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `completed_date` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `badge_activities`
--

CREATE TABLE `badge_activities` (
  `activity_id` bigint(20) UNSIGNED NOT NULL,
  `badge_id` int(11) DEFAULT NULL,
  `activity_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `badge_activities`
--

INSERT INTO `badge_activities` (`activity_id`, `badge_id`, `activity_text`) VALUES
(14, 12, 'Walk or play with a pet daily.'),
(15, 12, 'Attend a pet care workshop.'),
(16, 12, 'Create a pet care schedule.'),
(17, 13, 'Attend an art class or workshop.'),
(18, 13, 'Visit an art gallery for inspiration.'),
(19, 13, 'Experiment with a new art medium.'),
(20, 14, 'Join a local sports team.'),
(21, 14, 'Follow a weekly fitness plan.'),
(22, 14, 'Track your progress with a fitness app.'),
(23, 15, 'Practice building a campfire.'),
(24, 15, 'Try a new outdoor recipe.'),
(25, 15, 'Teach someone else an outdoor cooking skill.'),
(26, 16, 'Visit a local library.'),
(27, 16, 'Read a classic novel.'),
(28, 16, 'Share book recommendations online.'),
(29, 17, 'Take a cooking class.'),
(30, 17, 'Experiment with international cuisines.'),
(31, 17, 'Host a dinner party.'),
(32, 18, 'Attend a collectors’ fair or swap meet.'),
(33, 18, 'Create a catalog of your collection.'),
(34, 18, 'Join a collectors’ community online.'),
(35, 19, 'Take a radio operation course.'),
(36, 19, 'Practice Morse code with a friend.'),
(37, 19, 'Explore communication technology history.');

-- --------------------------------------------------------

--
-- Структура таблицы `badge_requirements`
--

CREATE TABLE `badge_requirements` (
  `requirement_id` bigint(20) UNSIGNED NOT NULL,
  `badge_id` int(11) DEFAULT NULL,
  `requirement_text` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `badge_requirements`
--

INSERT INTO `badge_requirements` (`requirement_id`, `badge_id`, `requirement_text`) VALUES
(14, 12, 'Care for a pet for at least one month.'),
(15, 12, 'Learn about proper pet nutrition and health.'),
(16, 12, 'Volunteer at an animal shelter or participate in a pet-related community event.'),
(17, 13, 'Create three original artworks in any medium (e.g., painting, drawing, sculpture).'),
(18, 13, 'Learn about an art style or technique (e.g., watercolor, charcoal).'),
(19, 13, 'Share your artwork with a community or online platform.'),
(20, 14, 'Participate in a competitive sport event or complete a fitness challenge (e.g., 5K run).'),
(21, 14, 'Train consistently for at least six weeks.'),
(22, 14, 'Achieve a personal best in a sport or fitness metric.'),
(23, 15, 'Cook three different meals outdoors using a campfire or portable stove.'),
(24, 15, 'Learn safe fire-building techniques.'),
(25, 15, 'Clean and pack out all cooking materials responsibly.'),
(26, 16, 'Read five books from at least two different genres.'),
(27, 16, 'Write a short review for each book.'),
(28, 16, 'Join or start a book club discussion.'),
(29, 17, 'Prepare a three-course meal from scratch.'),
(30, 17, 'Learn five advanced cooking techniques (e.g., braising, sous-vide).'),
(31, 17, 'Create an original recipe.'),
(32, 18, 'Build a collection of at least 10 unique items.'),
(33, 18, 'Research the history or value of your collection.'),
(34, 18, 'Display or share your collection with others.'),
(35, 19, 'Learn and demonstrate a communication method (e.g., Morse code, radio signals).'),
(36, 19, 'Understand the basics of a communication system (e.g., ham radio, satellite).'),
(37, 19, 'Communicate with someone using your chosen method.');

-- --------------------------------------------------------

--
-- Структура таблицы `badge_resources`
--

CREATE TABLE `badge_resources` (
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `badge_id` int(11) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `resource_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `events`
--

CREATE TABLE `events` (
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `location_name` varchar(100) DEFAULT NULL,
  `location_address` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `required_helpers` int(11) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `equipment` text DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `public_visible` tinyint(1) DEFAULT 1,
  `leaders_only_visible` tinyint(1) DEFAULT 0,
  `helpers_only_visible` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `max_participants` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `events`
--

INSERT INTO `events` (`event_id`, `title`, `description`, `location_name`, `location_address`, `latitude`, `longitude`, `start_date`, `end_date`, `start_time`, `end_time`, `event_type`, `required_helpers`, `created_by`, `notes`, `equipment`, `cost`, `public_visible`, `leaders_only_visible`, `helpers_only_visible`, `created_at`, `max_participants`) VALUES
(12, 'Coastal Clean-Up Outing', 'A fun, eco-friendly day cleaning Portobello beach and learning about ocean life.', 'Portobello Beach', 'Promenade, Edinburgh EH15 2DX', 55.95480000, -3.11130000, '2025-06-08', '2025-06-08', '10:00:00', '02:00:00', 'Outing', 5, 19, 'Parents welcome to join.', 'Gloves, rubbish bags, packed lunch', 5.00, 1, 0, 0, '2025-05-21 11:14:50', 0),
(13, ' Artist in Nature Day', 'A creative outing where scouts draw and paint Scottish landscapes.\n', 'Holyrood Park', 'Queen’s Drive, Edinburgh EH8 8HG', 55.94450000, -3.16180000, '2025-06-15', '2025-06-15', '11:00:00', '16:00:00', 'Outing', 3, 19, 'Dress for weather.', 'Sketch pad, pencils, paints', 7.99, 1, 0, 0, '2025-05-21 11:16:43', 0),
(14, 'Bookworms Book Fair', 'Scouts share and swap books they’ve read. Discussion and games follow.', 'Stirling Public Library', 'Corn Exchange Rd, Stirling FK8 2HX', 56.11900000, -3.93690000, '2025-06-05', '2025-06-05', '13:00:00', '16:00:00', 'Other', 1, 19, 'Bring a book to donate.', 'Favourite book, library card', 0.00, 1, 0, 0, '2025-05-21 11:18:16', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `event_attendance`
--

CREATE TABLE `event_attendance` (
  `attendance_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `check_in_time` timestamp NULL DEFAULT NULL,
  `check_out_time` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `event_attendance`
--

INSERT INTO `event_attendance` (`attendance_id`, `event_id`, `user_id`, `check_in_time`, `check_out_time`, `notes`) VALUES
(2, 14, 17, '2025-05-21 21:24:39', '2025-05-26 11:43:15', NULL),
(3, 14, 21, '2025-05-21 21:24:40', '2025-05-26 11:43:14', NULL),
(4, 13, 17, '2025-05-21 21:25:07', '2025-05-21 21:25:20', NULL),
(5, 12, 17, '2025-05-21 21:25:46', NULL, NULL),
(6, 12, 21, '2025-05-21 21:25:47', NULL, NULL),
(7, 14, 24, '2025-05-23 20:32:54', '2025-05-23 20:33:00', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `event_badges`
--

CREATE TABLE `event_badges` (
  `event_id` int(11) NOT NULL,
  `badge_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `event_badges`
--

INSERT INTO `event_badges` (`event_id`, `badge_id`) VALUES
(8, 19),
(10, 12),
(11, 19),
(12, 18),
(12, 19),
(13, 13),
(14, 16);

-- --------------------------------------------------------

--
-- Структура таблицы `event_helpers`
--

CREATE TABLE `event_helpers` (
  `event_id` int(11) NOT NULL,
  `helper_id` int(11) NOT NULL,
  `confirmed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `event_helpers`
--

INSERT INTO `event_helpers` (`event_id`, `helper_id`, `confirmed`) VALUES
(12, 7, 1),
(13, 8, 1),
(14, 1, 1),
(14, 2, 1),
(14, 3, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `event_participants`
--

CREATE TABLE `event_participants` (
  `participant_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(20) DEFAULT 'registered',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `event_participants`
--

INSERT INTO `event_participants` (`participant_id`, `event_id`, `user_id`, `registration_date`, `status`, `notes`) VALUES
(4, 14, 17, '2025-05-21 19:17:42', 'cancelled', ''),
(5, 13, 17, '2025-05-21 19:18:38', 'cancelled', 'asd'),
(6, 12, 17, '2025-05-21 19:19:08', 'attended', ''),
(7, 14, 21, '2025-05-21 19:23:10', 'attended', ''),
(8, 12, 21, '2025-05-21 19:24:48', 'attended', ''),
(9, 12, 24, '2025-05-23 21:15:20', 'cancelled', ''),
(10, 14, 24, '2025-05-23 21:15:59', 'attended', '');

-- --------------------------------------------------------

--
-- Структура таблицы `event_reminders`
--

CREATE TABLE `event_reminders` (
  `reminder_id` bigint(20) UNSIGNED NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `reminder_type` varchar(20) DEFAULT NULL,
  `reminder_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `sent` tinyint(1) DEFAULT 0,
  `sent_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `helpers`
--

CREATE TABLE `helpers` (
  `helper_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `street_address` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `postcode` varchar(10) DEFAULT NULL,
  `disclosure_status` tinyint(1) DEFAULT 0,
  `disclosure_date_obtained` date DEFAULT NULL,
  `disclosure_expiry_date` date DEFAULT NULL,
  `disclosure_reference` varchar(50) DEFAULT NULL,
  `training_completed` tinyint(1) DEFAULT 0,
  `training_in_progress` tinyint(1) DEFAULT 0,
  `skills` text DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `helpers`
--

INSERT INTO `helpers` (`helper_id`, `user_id`, `contact_number`, `street_address`, `city`, `postcode`, `disclosure_status`, `disclosure_date_obtained`, `disclosure_expiry_date`, `disclosure_reference`, `training_completed`, `training_in_progress`, `skills`, `notes`) VALUES
(1, 6, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', ''),
(2, 12, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', ''),
(3, 3, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', ''),
(4, 16, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', ''),
(5, 18, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, 'ujynh', 'yjtnhfbgv'),
(6, 19, '07437159073', 'Flat 2/02', 'Glasgow', 'G22 5JW', 0, NULL, NULL, '', 0, 0, 'пиав', 'впи'),
(7, 20, '07437159073', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', ''),
(8, 25, '123', '181 Pitt st. Hotel Novotel Glasgow. G2 4DT', 'Glasgow', 'G2 4DT', 0, NULL, NULL, '', 0, 0, '', '');

-- --------------------------------------------------------

--
-- Структура таблицы `helper_availability`
--

CREATE TABLE `helper_availability` (
  `availability_id` bigint(20) UNSIGNED NOT NULL,
  `helper_id` int(11) DEFAULT NULL,
  `day_of_week` varchar(10) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `helper_training_modules`
--

CREATE TABLE `helper_training_modules` (
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `helper_id` int(11) DEFAULT NULL,
  `module_name` varchar(100) NOT NULL,
  `completed` tinyint(1) DEFAULT 0,
  `date_completed` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `leaders`
--

CREATE TABLE `leaders` (
  `leader_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `position` varchar(50) NOT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `emergency_contact_name` varchar(100) DEFAULT NULL,
  `emergency_contact_relationship` varchar(50) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `newsletters`
--

CREATE TABLE `newsletters` (
  `newsletter_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sent_at` timestamp NULL DEFAULT NULL,
  `is_sent` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `newsletters`
--

INSERT INTO `newsletters` (`newsletter_id`, `title`, `content`, `created_by`, `created_at`, `sent_at`, `is_sent`) VALUES
(1, 'Летний выпуск 2023', 'Добро пожаловать в летний выпуск нашей рассылки! В этом выпуске мы расскажем о предстоящих мероприятиях и достижениях наших участников.', 2, '2025-05-13 17:21:45', NULL, 0),
(2, 'Специальный выпуск: Летний лагерь', 'Информация о предстоящем летнем лагере. Даты, место проведения, необходимое снаряжение и многое другое.', 11, '2025-05-13 17:21:45', NULL, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `newsletter_subscriptions`
--

CREATE TABLE `newsletter_subscriptions` (
  `subscription_id` bigint(20) UNSIGNED NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `subscribed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1,
  `unsubscribed_at` timestamp NULL DEFAULT NULL,
  `pref_events` tinyint(1) DEFAULT 1,
  `pref_badges` tinyint(1) DEFAULT 1,
  `pref_general` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `newsletter_subscriptions`
--

INSERT INTO `newsletter_subscriptions` (`subscription_id`, `email`, `first_name`, `last_name`, `subscribed_at`, `is_active`, `unsubscribed_at`, `pref_events`, `pref_badges`, `pref_general`) VALUES
(1, 'test1@example.com', 'John', 'Doe', '2025-05-13 17:21:45', 1, NULL, 1, 1, 1),
(2, 'test2@example.com', 'Jane', 'Smith', '2025-05-13 17:21:45', 1, NULL, 1, 1, 1),
(3, 'test3@example.com', 'Robert', 'Johnson', '2025-05-13 17:21:45', 1, NULL, 1, 1, 1),
(4, 'papin.vlad2010@gmail.com', 'Vladyslav', 'Papin', '2025-05-13 17:21:45', 1, NULL, 1, 1, 1),
(5, 'john1helper@gmail.com', 'Helper', 'Jhon Helper Smith', '2025-05-16 17:46:15', 1, NULL, 1, 1, 1),
(6, 'leader1@gmail.com', 'Leader', 'Joana Leader Mathim', '2025-05-16 22:23:35', 1, NULL, 1, 1, 1),
(7, 'scout1@gmail.com', 'Scout', 'Garry Scout Smith', '2025-05-20 17:51:35', 1, NULL, 1, 1, 1),
(8, 'pukpuk@gmail.com', 'Puk', 'Valeriy', '2025-05-23 21:12:46', 0, '2025-05-23 21:13:00', 1, 1, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `notification_type` varchar(50) NOT NULL,
  `reference_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `title`, `content`, `created_at`, `is_read`, `read_at`, `notification_type`, `reference_id`) VALUES
(1, 5, 'Новый значок', 'Вы получили значок Астронома!', '2025-05-13 17:21:45', 0, NULL, 'badge', 3),
(2, 6, 'Новый значок', 'Вы получили значок Астронома!', '2025-05-13 17:21:45', 0, NULL, 'badge', 3),
(3, 6, 'Новое сообщение', 'У вас новое сообщение от Vladyslav Papin', '2025-05-13 17:21:45', 0, NULL, 'message', 1),
(4, 7, 'Новое сообщение', 'У вас новое сообщение от vlad Papin', '2025-05-13 17:21:45', 0, NULL, 'message', 3),
(5, 3, 'Новое сообщение', 'У вас новое сообщение от Vladyslav Papin', '2025-05-13 17:21:45', 0, NULL, 'message', 5),
(6, 5, 'Новое объявление', 'Опубликовано новое объявление: Новые значки доступны', '2025-05-13 17:21:45', 0, NULL, 'announcement', 4),
(7, 3, 'New Announcement', 'New announcement: кпуацфвуйыф', '2025-05-13 21:19:38', 0, NULL, 'announcement', 5),
(8, 6, 'New Announcement', 'New announcement: кпуацфвуйыф', '2025-05-13 21:19:38', 0, NULL, 'announcement', 5),
(9, 12, 'New Announcement', 'New announcement: кпуацфвуйыф', '2025-05-13 21:19:38', 0, NULL, 'announcement', 5),
(10, 18, 'New Badge Awarded', 'You have been awarded the Athletics badge!', '2025-05-16 18:24:37', 1, '2025-05-16 18:33:32', 'badge', 4),
(11, 18, 'New Badge Awarded', 'You have been awarded the Cyclist badge!', '2025-05-16 18:28:00', 1, '2025-05-16 18:33:31', 'badge', 8),
(12, 5, 'New Badge Awarded', 'You have been awarded the Athletics badge!', '2025-05-17 13:27:26', 0, NULL, 'badge', 4),
(13, 17, 'New Badge Awarded', 'You have been awarded the Athletics Badge badge!', '2025-05-20 17:44:11', 1, '2025-05-20 17:46:57', 'badge', 14),
(14, 21, 'New Badge Awarded', 'You have been awarded the Artist Badge badge!', '2025-05-21 19:27:45', 1, '2025-05-21 19:28:21', 'badge', 13),
(15, 21, 'New Badge Awarded', 'You have been awarded the Pets Badge badge!', '2025-05-21 19:27:57', 1, '2025-05-21 19:28:21', 'badge', 12),
(16, 24, 'New Badge Awarded', 'You have been awarded the Artist Badge badge!', '2025-05-23 21:35:36', 0, NULL, 'badge', 13);

-- --------------------------------------------------------

--
-- Структура таблицы `photos`
--

CREATE TABLE `photos` (
  `photo_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `event_id` int(11) DEFAULT NULL,
  `public_visible` tinyint(1) DEFAULT 1,
  `leaders_only_visible` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `photos`
--

INSERT INTO `photos` (`photo_id`, `title`, `description`, `image_url`, `thumbnail_url`, `uploaded_by`, `upload_date`, `event_id`, `public_visible`, `leaders_only_visible`) VALUES
(12, 'Young Readers Lost in Stories', 'Children gathered around a colorful book stand at the Bookworms Book Fair, exploring new stories with curiosity and joy. The atmosphere was filled with excitement as young readers shared their favourite books and discovered new adventures together.', '/uploads/photo-1747864923365-847318054.jpg', '\\uploads\\thumbnails\\photo-1747864923365-847318054.jpg', 19, '2025-05-21 22:02:03', 14, 1, 0),
(13, 'Together for a Cleaner Coast', 'Volunteers of all ages joined forces during the Coastal Clean-Up Outing to collect litter along the shoreline. With gloves and bags in hand, they worked as a team to protect marine life and make the beach a cleaner, safer place for everyone.', '/uploads/photo-1747865030969-640166591.jpg', '\\uploads\\thumbnails\\photo-1747865030969-640166591.jpg', 19, '2025-05-21 22:03:51', 12, 1, 0),
(14, 'Art Inspired by the Wild', 'During Artist In Nature Day, young artists set up their easels among trees and flowers, using the beauty of the outdoors as their inspiration. Surrounded by nature, they painted landscapes, sketched animals, and shared their creative visions in a peaceful and joyful atmosphere.', '/uploads/photo-1747865122833-987569634.jpg', '\\uploads\\thumbnails\\photo-1747865122833-987569634.jpg', 19, '2025-05-21 22:05:22', 13, 1, 0),
(15, 'Incredible photo of our whole scouts family', 'It was such a beautiful day for making the photography ', '/uploads/photo-1747866128291-623176426.jpg', '\\uploads\\thumbnails\\photo-1747866128291-623176426.jpg', 19, '2025-05-21 22:22:08', NULL, 1, 0),
(16, 'Troop', 'Nothing to say - only emotions ', '/uploads/photo-1747866207836-294042964.jpg', '\\uploads\\thumbnails\\photo-1747866207836-294042964.jpg', 19, '2025-05-21 22:23:27', NULL, 1, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `photo_tags`
--

CREATE TABLE `photo_tags` (
  `photo_id` int(11) NOT NULL,
  `tag` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `photo_tags`
--

INSERT INTO `photo_tags` (`photo_id`, `tag`) VALUES
(12, '\"Afternoon\"'),
(12, '\"Excursion\"'),
(12, '\"Group\"'),
(12, '\"Joy\"'),
(12, '\"Sunny\"]'),
(12, '\"Teamwork\"'),
(12, '[\"Training\"'),
(13, '\"Badge\"'),
(13, '\"Cloudy\"'),
(13, '\"Group\"'),
(13, '\"Lake\"'),
(13, '\"Morning\"'),
(13, '\"Spring\"]'),
(13, '[\"Teamwork\"'),
(14, '\"Afternoon\"'),
(14, '\"Children\"'),
(14, '\"Competition\"'),
(14, '\"Excitement\"'),
(14, '\"Games\"'),
(14, '\"Joy\"'),
(14, '\"Park\"'),
(14, '\"Sports\"'),
(14, '\"Summer\"'),
(14, '\"Sunny\"]'),
(14, '\"Victory\"'),
(14, '[\"Badge\"'),
(15, '\"Adults\"'),
(15, '\"Joy\"'),
(15, '\"Meeting\"'),
(15, '\"Morning\"'),
(15, '\"Park\"'),
(15, '\"Spring\"'),
(15, '\"Sunny\"]'),
(15, '[\"Victory\"'),
(16, '\"Adults\"'),
(16, '\"Joy\"'),
(16, '\"Spring\"'),
(16, '\"Sunny\"]'),
(16, '[\"Award\"');

-- --------------------------------------------------------

--
-- Структура таблицы `photo_tag_categories`
--

CREATE TABLE `photo_tag_categories` (
  `category_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `photo_tag_categories`
--

INSERT INTO `photo_tag_categories` (`category_id`, `name`) VALUES
(1, 'Events'),
(2, 'Activities'),
(3, 'Places'),
(4, 'Seasons'),
(5, 'Achievements'),
(6, 'Emotions'),
(7, 'Weather'),
(8, 'Time of Day'),
(9, 'People'),
(10, 'Objects');

-- --------------------------------------------------------

--
-- Структура таблицы `predefined_photo_tags`
--

CREATE TABLE `predefined_photo_tags` (
  `tag_id` int(11) NOT NULL,
  `tag` varchar(50) NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `predefined_photo_tags`
--

INSERT INTO `predefined_photo_tags` (`tag_id`, `tag`, `category_id`) VALUES
(1, 'Camp', 1),
(2, 'Hiking', 1),
(3, 'Competition', 1),
(4, 'Holiday', 1),
(5, 'Meeting', 1),
(6, 'Excursion', 1),
(7, 'Sports', 2),
(8, 'Games', 2),
(9, 'Crafts', 2),
(10, 'Training', 2),
(11, 'Swimming', 2),
(12, 'Campfire', 2),
(13, 'Cooking', 2),
(14, 'Forest', 3),
(15, 'Lake', 3),
(16, 'Mountains', 3),
(17, 'Park', 3),
(18, 'School', 3),
(19, 'Club', 3),
(20, 'Spring', 4),
(21, 'Summer', 4),
(22, 'Autumn', 4),
(23, 'Winter', 4),
(24, 'Badge', 5),
(25, 'Award', 5),
(26, 'Certificate', 5),
(27, 'Victory', 5),
(28, 'Teamwork', 5),
(29, 'Joy', 6),
(30, 'Surprise', 6),
(31, 'Pride', 6),
(32, 'Excitement', 6),
(33, 'Sunny', 7),
(34, 'Rainy', 7),
(35, 'Snowy', 7),
(36, 'Cloudy', 7),
(37, 'Morning', 8),
(38, 'Afternoon', 8),
(39, 'Evening', 8),
(40, 'Night', 8),
(41, 'Children', 9),
(42, 'Adults', 9),
(43, 'Group', 9),
(44, 'Volunteers', 9),
(45, 'Tent', 10),
(46, 'Backpack', 10),
(47, 'Camera', 10),
(48, 'Bicycle', 10);

-- --------------------------------------------------------

--
-- Структура таблицы `training_resources`
--

CREATE TABLE `training_resources` (
  `resource_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `resource_type` varchar(20) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `file_type` varchar(10) DEFAULT NULL,
  `uploaded_by` int(11) DEFAULT NULL,
  `upload_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(50) DEFAULT NULL,
  `public_visible` tinyint(1) DEFAULT 1,
  `leaders_only_visible` tinyint(1) DEFAULT 0,
  `helpers_only_visible` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `role` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `email`, `first_name`, `last_name`, `role`, `created_at`, `last_login`) VALUES
(17, 'scout1', '$2a$10$Cr0q8QSYmdNco8sKcMo8HuGH157e9acKmORx9SbPEuiyNrwMwaLpG', 'scout1@gmail.com', 'Scout Garry', 'Scout Smith', 'public', '2025-05-16 12:47:47', '2025-05-26 12:43:37'),
(19, 'leader1', '$2a$10$BD39p..0bcpggq/n9MAcKOapSy.mRFKJ2K.VndKKh99NBEN/V4gaq', 'leader1@gmail.com', 'Leader Joanaп', 'Leader Mathim', 'leader', '2025-05-16 12:52:25', '2025-05-26 12:37:14'),
(20, 'helper2', '$2a$10$i8XIlRA2Kx.UcD1W./iBFu8c7IIyjXzX.XeYVWZRQ9jsEAcqb7Hha', 'helper2@gmail.com', 'Helper Helen', 'Helper Heriot', 'helper', '2025-05-20 18:49:28', '2025-05-21 19:21:15'),
(21, 'scout2', '$2a$10$B9g46vU7zWpSjdAwOv6fL.IgefwUdcQYl5SUeSIdlOwPVoXIaE9eq', 'scout2@gmail.com', 'Gerry', 'Smith', 'public', '2025-05-21 19:23:01', '2025-05-21 19:28:07'),
(22, 'scout3', '$2a$10$6A/yauj14qRhXMvI.EvQOux0cSGL3x6SIM1ftm0BZr4lvuNZurhTm', 'scout3@gmail.com', 'Amanda', 'Smith', 'leader', '2025-05-22 12:13:12', NULL),
(24, 'Puk', '$2a$10$YpAYmzqny4/dszpxp.h/k.jJy7WrURS/zEm5mpfMmO/u/.2/JMIHy', 'pukpuk@gmail.com', 'Puk', 'Valeriy', 'public', '2025-05-23 21:12:08', NULL),
(25, 'Srenk', '$2a$10$6GMXWFSYcmscD24amKHmKemuB8FradVoXkKXCS9s2TZ/qbNI05b1S', 'srenk@gmail.com', 'Srenk', 'Anatoliy', 'helper', '2025-05-23 21:19:27', '2025-05-24 21:49:38'),
(26, 'Alexander Sheps', '$2a$10$YqMnQb6WSeN6IZCI.eGxbuApVE3VgNkcm5B5FYfDX5qgQIlCznB1e', 'AlexSheps@gmail.com', 'Alexander', 'Sheps', 'leader', '2025-05-23 21:24:33', NULL),
(27, 'asd', '$2a$10$4EeB/JGgmbmu1isaaHGKJeX7oT4Sw7k0msf4tnEfSsuoyQhrwks6e', 'papin@gmail.com', 'Vladyslav', 'Papin', 'public', '2025-05-24 23:31:22', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `user_notification_preferences`
--

CREATE TABLE `user_notification_preferences` (
  `user_id` int(11) NOT NULL,
  `email_messages` tinyint(1) DEFAULT 1,
  `email_announcements` tinyint(1) DEFAULT 1,
  `email_events` tinyint(1) DEFAULT 1,
  `email_badges` tinyint(1) DEFAULT 1,
  `site_messages` tinyint(1) DEFAULT 1,
  `site_announcements` tinyint(1) DEFAULT 1,
  `site_events` tinyint(1) DEFAULT 1,
  `site_badges` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_notification_preferences`
--

INSERT INTO `user_notification_preferences` (`user_id`, `email_messages`, `email_announcements`, `email_events`, `email_badges`, `site_messages`, `site_announcements`, `site_events`, `site_badges`) VALUES
(2, 1, 1, 1, 1, 1, 1, 1, 1),
(3, 1, 1, 1, 1, 1, 1, 1, 1),
(5, 1, 1, 1, 1, 1, 1, 1, 1),
(6, 1, 1, 1, 1, 1, 1, 1, 1),
(7, 1, 1, 1, 1, 1, 1, 1, 1),
(11, 1, 1, 1, 1, 1, 1, 1, 1);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_id`);

--
-- Индексы таблицы `badges`
--
ALTER TABLE `badges`
  ADD PRIMARY KEY (`badge_id`);

--
-- Индексы таблицы `badge_achievements`
--
ALTER TABLE `badge_achievements`
  ADD PRIMARY KEY (`achievement_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`badge_id`);

--
-- Индексы таблицы `badge_achievement_evidence`
--
ALTER TABLE `badge_achievement_evidence`
  ADD PRIMARY KEY (`evidence_id`);

--
-- Индексы таблицы `badge_achievement_progress`
--
ALTER TABLE `badge_achievement_progress`
  ADD PRIMARY KEY (`progress_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`requirement_id`);

--
-- Индексы таблицы `badge_activities`
--
ALTER TABLE `badge_activities`
  ADD PRIMARY KEY (`activity_id`);

--
-- Индексы таблицы `badge_requirements`
--
ALTER TABLE `badge_requirements`
  ADD PRIMARY KEY (`requirement_id`);

--
-- Индексы таблицы `badge_resources`
--
ALTER TABLE `badge_resources`
  ADD PRIMARY KEY (`resource_id`);

--
-- Индексы таблицы `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`event_id`);

--
-- Индексы таблицы `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD UNIQUE KEY `event_id` (`event_id`,`user_id`);

--
-- Индексы таблицы `event_badges`
--
ALTER TABLE `event_badges`
  ADD PRIMARY KEY (`event_id`,`badge_id`);

--
-- Индексы таблицы `event_helpers`
--
ALTER TABLE `event_helpers`
  ADD PRIMARY KEY (`event_id`,`helper_id`);

--
-- Индексы таблицы `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD UNIQUE KEY `event_id` (`event_id`,`user_id`);

--
-- Индексы таблицы `event_reminders`
--
ALTER TABLE `event_reminders`
  ADD PRIMARY KEY (`reminder_id`);

--
-- Индексы таблицы `helpers`
--
ALTER TABLE `helpers`
  ADD PRIMARY KEY (`helper_id`);

--
-- Индексы таблицы `helper_availability`
--
ALTER TABLE `helper_availability`
  ADD PRIMARY KEY (`availability_id`);

--
-- Индексы таблицы `helper_training_modules`
--
ALTER TABLE `helper_training_modules`
  ADD PRIMARY KEY (`module_id`);

--
-- Индексы таблицы `leaders`
--
ALTER TABLE `leaders`
  ADD PRIMARY KEY (`leader_id`);

--
-- Индексы таблицы `newsletters`
--
ALTER TABLE `newsletters`
  ADD PRIMARY KEY (`newsletter_id`);

--
-- Индексы таблицы `newsletter_subscriptions`
--
ALTER TABLE `newsletter_subscriptions`
  ADD PRIMARY KEY (`subscription_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`);

--
-- Индексы таблицы `photos`
--
ALTER TABLE `photos`
  ADD PRIMARY KEY (`photo_id`);

--
-- Индексы таблицы `photo_tags`
--
ALTER TABLE `photo_tags`
  ADD PRIMARY KEY (`photo_id`,`tag`);

--
-- Индексы таблицы `photo_tag_categories`
--
ALTER TABLE `photo_tag_categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Индексы таблицы `predefined_photo_tags`
--
ALTER TABLE `predefined_photo_tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `tag` (`tag`),
  ADD KEY `category_id` (`category_id`);

--
-- Индексы таблицы `training_resources`
--
ALTER TABLE `training_resources`
  ADD PRIMARY KEY (`resource_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `user_notification_preferences`
--
ALTER TABLE `user_notification_preferences`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT для таблицы `badges`
--
ALTER TABLE `badges`
  MODIFY `badge_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT для таблицы `badge_achievements`
--
ALTER TABLE `badge_achievements`
  MODIFY `achievement_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `badge_achievement_evidence`
--
ALTER TABLE `badge_achievement_evidence`
  MODIFY `evidence_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `badge_achievement_progress`
--
ALTER TABLE `badge_achievement_progress`
  MODIFY `progress_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `badge_activities`
--
ALTER TABLE `badge_activities`
  MODIFY `activity_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT для таблицы `badge_requirements`
--
ALTER TABLE `badge_requirements`
  MODIFY `requirement_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT для таблицы `badge_resources`
--
ALTER TABLE `badge_resources`
  MODIFY `resource_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `events`
--
ALTER TABLE `events`
  MODIFY `event_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT для таблицы `event_attendance`
--
ALTER TABLE `event_attendance`
  MODIFY `attendance_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `participant_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `event_reminders`
--
ALTER TABLE `event_reminders`
  MODIFY `reminder_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `helpers`
--
ALTER TABLE `helpers`
  MODIFY `helper_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `helper_availability`
--
ALTER TABLE `helper_availability`
  MODIFY `availability_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `helper_training_modules`
--
ALTER TABLE `helper_training_modules`
  MODIFY `module_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `leaders`
--
ALTER TABLE `leaders`
  MODIFY `leader_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `newsletters`
--
ALTER TABLE `newsletters`
  MODIFY `newsletter_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `newsletter_subscriptions`
--
ALTER TABLE `newsletter_subscriptions`
  MODIFY `subscription_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `photos`
--
ALTER TABLE `photos`
  MODIFY `photo_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `photo_tag_categories`
--
ALTER TABLE `photo_tag_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `predefined_photo_tags`
--
ALTER TABLE `predefined_photo_tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT для таблицы `training_resources`
--
ALTER TABLE `training_resources`
  MODIFY `resource_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `predefined_photo_tags`
--
ALTER TABLE `predefined_photo_tags`
  ADD CONSTRAINT `predefined_photo_tags_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `photo_tag_categories` (`category_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

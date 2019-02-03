// PAGES
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';

// PROVIDERS
import { Electron } from '../providers/electron/electron';
import { Api } from '../providers/api/api';
import { Common } from '../providers/common/common';
import { LogerProvider } from '../providers/loger/loger';
import { DataProvider } from '../providers/data/data';
import { SocketProvider } from '../providers/socket/socket';
import { WeatherProvider } from '../providers/weather/weather';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { SearchPage } from '../pages/search/search';
import { RoomChatPage } from '../pages/room-chat/room-chat';
import { RoomListPage } from '../pages/room-list/room-list';
import { RoomWaitingPage } from '../pages/room-waiting/room-waiting';
import { RoomPage } from '../pages/room/room';
import { PenggunaPage } from '../pages/pengguna/pengguna';

export const PAGES = [
  HomePage,
  MenuPage,
  DashboardPage,
  SettingsPage,
  LoginPage,
  TabsPage,
  ProfilePage,
  AboutPage,
  ContactPage,
  SearchPage,
  RoomPage,
  RoomChatPage,
  RoomListPage,
  RoomWaitingPage,
  PenggunaPage
];

export const PROVIDERS = [
  Electron,
  Api,
  Common,
  LogerProvider,
  DataProvider,
  SocketProvider,
  WeatherProvider
];
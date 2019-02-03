import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { PAGES, PROVIDERS } from './app.import';

import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'angular2-markdown';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

// Emoji
import { EmojiPickerComponentModule } from '../components/emoji-picker/emoji-picker.module';
import { EmojiProvider } from '../providers/emoji';
import { FeedProvider } from '../providers/feed/feed';

@NgModule({
  declarations: [
    MyApp,
    PAGES
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: ' ',
    }),
    SocketIoModule.forRoot(config),
    MarkdownModule.forRoot(),
    IonicStorageModule.forRoot(),
    EmojiPickerComponentModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PAGES
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PROVIDERS,
    EmojiProvider,
    FeedProvider
  ]
})
export class AppModule {}

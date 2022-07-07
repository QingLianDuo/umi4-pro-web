console.log('global.ts');
import { configurePersistable } from 'mobx-persist-store';

// // All properties are optional
// configurePersistable(
//     {
//         storage: window.localStorage,
//         expireIn: 86400000,
//         removeOnExpiration: true,
//         stringify: false,
//         debugMode: true,
//     },
//     { delay: 200, fireImmediately: false }
// );

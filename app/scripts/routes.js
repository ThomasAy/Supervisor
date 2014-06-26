var router = new Router({ 
    '/':        function() { app.deviceId = -1; updateInfos(); app.currentView = 'multi'; }, 
    '/settings/': function() { app.deviceId = -1; app.currentView = 'settings'; }, 
    '/device/:id': function(id) { app.deviceId = id ; app.currentView = 'fiche'; getLogFromIp(app.devices[id].ip)}
}); 
router.init();
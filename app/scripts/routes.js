var router = new Router({ 
    '/':        function() { updateInfos(); app.currentView = 'multi'; }, 
    '/settings/': function() { app.currentView = 'settings'; }, 
    '/device/:id': function(id) { app.deviceId = id ; app.currentView = 'fiche'; getLogFromIp(app.devices[id].ip)}
}); 
router.init();
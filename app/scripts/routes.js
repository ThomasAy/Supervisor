var router = new Router({ 
    '/':        function() { app.currentView = 'multi' }, 
    '/settings/': function() { app.currentView = 'settings'; }, 
}); 
router.init();
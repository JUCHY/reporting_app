
requirejs.config({
    baseUrl: 'js',

});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['createtable'])
requirejs(['fetchapi'])
requirejs(['googlecharts'])
requirejs(['index']);
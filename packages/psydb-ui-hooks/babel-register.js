require("@babel/register")({
    // Ignore everything in node_modules except node_modules/@mpieva.
    ignore: [ /node_modules\/(?!@mpieva)/ ]
});

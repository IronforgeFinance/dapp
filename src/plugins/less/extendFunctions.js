module.exports = {
    install: function (less, pluginManager, functions) {
        functions.add('adaptToPc', function ({ value }) {
            return `${(value / 1920) * 100}vw`;
        });
    },
};

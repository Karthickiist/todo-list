exports.date = function() {
    const date = new Date();

    const formattedDate = date.toLocaleString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

    return formattedDate;
}
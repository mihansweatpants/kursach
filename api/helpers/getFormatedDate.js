function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

// Using this to name uploaded files
// Removing colons from the time string because windows doesn't allow using it to name files

function getFormatedDate() {
    let dateString = new Date().toString();

    dateString = dateString.slice(0, dateString.indexOf(' G'));
    dateString = replaceAll(dateString, ':', '-');
    dateString = replaceAll(dateString, ' ', '-');

    return dateString;
}

module.exports = getFormatedDate;

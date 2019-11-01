module.exports.timer = function timer(ammount) {

    return new Promise((resolve) => {
        setTimeout(() => resolve(), ammount);
    });
}
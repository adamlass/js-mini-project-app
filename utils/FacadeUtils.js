
class FacadeUtils {
    makeOptions(method, body) {
        var opts = {
            method: method,
            headers: {
                "Content-type": "application/json",
                'Accept': 'application/json',
            }
        }

        if (body) {
            opts.body = JSON.stringify(body);
        }

        return opts;
    }
    
    async handleHttpErrors(res) {
        if (!res.ok) {
            console.log("error")
            const fullError = await res.json();
            throw { status: res.status, fullError };
        }
        const json = await res.json();
        return json;
    }
}

module.exports = new FacadeUtils()
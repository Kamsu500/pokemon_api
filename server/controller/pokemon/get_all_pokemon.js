module.exports.get_all = async (event,context) => {

    context.callbackWaitsForEmptyEventLoop = false;

    try {

       /*  const authentication_data = is_user_authenticated(event.headers.Authorization);

        if (!authentication_data.ok) {
        return {
            statusCode : authentication_data.statusCode,
            headers: {
                'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: authentication_data.message })
        }
        } */

        pokemon_url = "https://pokeapi.co/api/v2/pokemon/ditto";

        const response = await fetch(pokemon_url);
        const pokemon_to_json = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'resultcode': 200
            },
            body: JSON.stringify({ all_pokemon : pokemon_to_json })
        }

    }
    catch (e) {
        console.log(e);

        return  {
            statusCode: 500,
            headers: { 'resultcode': 500 }
        };

    } 

};
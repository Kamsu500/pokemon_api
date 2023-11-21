module.exports.send = async (event, context) => {
  try {
    context.callbackWaitsForEmptyEventLoop = false;

    // retrieve data from PokeAPI

    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=40"
    );
    const pokemon_data = await response.json();
    console.log(pokemon_data);

    // get all json pokemon

    if (pokemon_species.results) {
      var x = pokemon_species.results.forEach(async (pokemon) => {
        const pokemon_response = await fetch(pokemon.url);
        return await pokemon_response.json();
      });
    }

    // send data to hubspot

    const hub_spot_response = await fetch("https://api.hubspot.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(x),
    });

    // check HubSpot response and resend appropriate message

    if (hub_spot_response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Data have been saved successfully in HubSpot",
        }),
      };
    } else {
      return {
        statusCode: hub_spot_response.status,
        body: JSON.stringify({ message: "An error has occured" }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "An error has occured" }),
    };
  }
};

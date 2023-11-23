const HUBSPOT_API_KEY = "pat-eu1-e9abd65a-dcbf-411c-89cc-f98e808facb5";

module.exports.send_pokemon_to_hubspot = async () => {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species?limit=40"
    );
    const pokemon_data = await response.json();
    const pokemon_list = pokemon_data.results;

    // Format the Pokémon data into contacts for HubSpot
    const contacts = pokemon_list.map((pokemon) => ({
      properties: [
        { property: "name", value: pokemon.name },
        { property: "weight", value: pokemon.weight },
        { property: "height", value: pokemon.height },

      ],
    }));

    // Send contacts to HubSpot
    const hub_spot_responses = await Promise.all(
      contacts.map((contact) =>
        fetch(
          `https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=${HUBSPOT_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": HUBSPOT_API_KEY
            },
            body: JSON.stringify(contact),
          }
        ).then((res) => res.json())
      )
    );

    console.log(hub_spot_responses);

    return {
      statusCode: 200,
      body: JSON.stringify(hub_spot_responses),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

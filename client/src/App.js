import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./component/navbar/Navbar";
import "./App.css";

const App = () => {
  const [pokemon_species_data, set_pokemon_species_data] = useState([]);
  const [pokemon_details, set_pokemon_details] = useState([]);
  const [loading_details, set_loading_details] = useState(true);
  const url_species_pokemon =
    "https://pokeapi.co/api/v2/pokemon-species?limit=40";

  // fetch species data
  const fetch_pokemon_species_data = useCallback(async () => {
    try {
      const response = await fetch(url_species_pokemon);
      const data = await response.json();
      console.log(data);
      set_pokemon_species_data(data.results);
    } catch (error) {
      console.error("Error fetching Pokemon species data:", error);
    }
  }, []);

  // fetch details data
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetch_details = async () => {
    try {
      const details_promises = pokemon_species_data.map(async (species) => {
        const species_esponse = await fetch(species.url);
        const species_data = await species_esponse.json();

        const pokemon_response = await fetch(
          species_data.varieties[0].pokemon.url
        );
        const pokemon_data = await pokemon_response.json();
        const category = species_data.genera.find(
          (genus) => genus.language.name === "en"
        ).genus;
        const abilities = pokemon_data.abilities.map((ability) => {
          return { ability: ability.ability.name };
        });
        const types = pokemon_data.types.map((type) => type.type.name);
        const sprites_response = await fetch(
          pokemon_data.sprites.front_default
        );
        const sprites_data = await sprites_response.blob();
        const image_url = URL.createObjectURL(sprites_data);

        return {
          name: species_data.name,
          description: species_data.flavor_text_entries.find(
            (entry) => entry.language.name === "en"
          ).flavor_text,
          height: pokemon_data.height,
          weight: pokemon_data.weight,
          category: category,
          abilities: abilities,
          image_url: image_url,
          types: types,
        };
      });

      const details = await Promise.all(details_promises);
      set_pokemon_details(details);
      set_loading_details(false);
    } catch (error) {
      console.error("Error fetching Pokemon details:", error);
    }
  };

  useEffect(() => {
    fetch_pokemon_species_data();
  }, [fetch_pokemon_species_data]);

  useEffect(() => {
    if (pokemon_species_data.length > 0) {
      fetch_details();
    }
  }, [fetch_details, pokemon_species_data]);

  return (
    <>
      <body className="bg-danger">
        <div className="h-25">
          <Navbar />
        </div>
        <div className="container-fluid mt-5" id="body">
          <div className="row">
            {loading_details ? (
              <p>Loading...</p>
            ) : (
              pokemon_details.map((pokemon, index) => {
                return (
                  <div className="col-sm-6 col-md-3 mb-4" key={index}>
                    <div className="card h-100" id="card">
                      {pokemon.image_url && (
                        <img
                          src={pokemon.image_url}
                          className="card-img-top"
                          alt={pokemon.name}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title">{pokemon.name}</h5>
                        <p class="card-text">{pokemon.description}</p>
                        <hr />
                        <div className="row col">
                          <div class="col-lg-6">
                            Taille : {pokemon.height} m
                          </div>
                          <div className="col-lg-6">
                            Talents:{" "}
                            {pokemon.abilities.map((ability, i) => (
                              <span key={i}>{ability.ability}</span>
                            ))}
                          </div>
                        </div>
                        <div className="row col">
                          <div class="col-lg-6">
                            Poids : {pokemon.weight} kg
                          </div>
                          <div class="col-lg-6">
                            category : {pokemon.category}
                          </div>
                        </div>
                        <hr />
                        <div>
                          {pokemon.types.map((type, i) => (
                            <span key={i} className="badge bg-primary mx-1">{type}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </body>
    </>
  );
};

export default App;

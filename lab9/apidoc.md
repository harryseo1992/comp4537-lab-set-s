**Title**
----
  Fetching all pokemons

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemons

  * **Optional:**

    https://agile-thicket-91714.herokuapp.com/api/v1/pokemons?count={count-value}&after={after-value}

* **Method:**

  `GET`
  
*  **URL Params**

   **Optional:**

   When searching for {count} pokemons after {after} ids.
 
   `count=[number]`
   `after=[number]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
  {
    "base": {
      "Sp": {
        " Attack": 65,
        " Defense": 65
      },
      "HP": 45,
      "Attack": 49,
      "Defense": 49,
      "Speed": 45
    },
    "name": {
      "english": "Bulbasaur",
      "japanese": "フシギダネ",
      "chinese": "妙蛙种子",
      "french": "Bulbizarre"
    },
    "_id": "63433aaae2544adf348f09d4",
    "id": 1,
    "type": [
      "Grass",
      "Poison"
    ],
    "__v": 0
  },
  {
    "base": {
      "Sp": {
        " Attack": 80,
        " Defense": 80
      },
      "HP": 60,
      "Attack": 62,
      "Defense": 63,
      "Speed": 60
    },
    "name": {
      "english": "Ivysaur",
      "japanese": "フシギソウ",
      "chinese": "妙蛙草",
      "french": "Herbizarre"
    },
    "_id": "63433aaae2544adf348f09d5",
    "id": 2,
    "type": [
      "Grass",
      "Poison"
    ],
    "__v": 0
  } ... 807 more responses,`
 
* **Error Response:**

  * **Reason:** Database error <br />
    **Content:** `{ "errMsg" : "DatabaseError: Try again or check your inputs." }`

  * **Reason:** Optional: Either values for count or after missing <br />
    **Content:** `{ "errMsg": "ValidationError: Either values for count or after is missing" }`

  * **Reason:** Optional: When entering improper count or after values <br />
    **Content:** `{ "errMsg": "Cannot find ${count} pokemon(s) after id: ${after}" }`

* **Sample Call:**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemons

  * **Optional:**

    https://agile-thicket-91714.herokuapp.com/api/v1/pokemons?count=2&after=10

* **Notes:**

  The fields `count` and `after` may be optional but if you are using them, you must use both. Having one value and leaving the other blank will give you an error.

**Title**
----
  Fetching a specific pokemon

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemons/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `[
  {
    "base": {
      "Sp": {
        " Attack": 65,
        " Defense": 65
      },
      "HP": 50,
      "Attack": 85,
      "Defense": 55,
      "Speed": 90
    },
    "name": {
      "english": "Ponyta",
      "japanese": "ポニータ",
      "chinese": "小火马",
      "french": "Ponyta"
    },
    "_id": "63433aaae2544adf348f0a20",
    "id": 77,
    "type": [
      "Fire"
    ],
    "__v": 0
  }
]`
 
* **Error Response:**

  * **Reason:** Wrong input: When you input a non-integer value <br />
    **Content:** `{ "errMsg" : "CastingError: pass pokemon id between 1 and 809" }`

  * **Reason:** Wrong input: Searching outside the boundary <br />
    **Content:** `{ "errMsg" : "Pokemon not found" }`

  * **Reason:** Wrong input: Database error <br />
    **Content:** `{ "errMsg" : "Database Error: Please try again" }`

* **Sample Call:**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemons/1


**Title**
----
  Adding a pokemon

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemon

* **Method:**

  `POST`

* **Data Params**

  **Body:** 
  `{
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "Sp": {
        " Attack": 65,
        " Defense": 65
      },
      "HP": 50,
      "Attack": 85,
      "Defense": 55,
      "Speed": 90
    },
    "id": 1000,
    "type": [
      "Bug"
    ],
    "__v": 0
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ "msg": "Added Successfully" }`
 
* **Error Response:**

  * **Reason:** When adding a pokemon with a name longer than 20 characters <br />
    **Content:** `{ "errMsg" : "ValidationError: check to make sure your inputs are correct" }`

  * **Reason:** Adding a pokemon with a duplicate Id <br />
    **Content:** 
      `{
        "errMsg": {
          "index": 0,
          "code": 11000,
          "keyPattern": {
            "id": 1
          },
          "keyValue": {
            "id": 1000
          }
        }
      }`
* **Sample Call:**

  curl -XPOST -H "Content-type: application/json" -d '{
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "Sp": {
        " Attack": 65,
        " Defense": 65
      },
      "HP": 50,
      "Attack": 85,
      "Defense": 55,
      "Speed": 90
    },
    "id": 1000,
    "type": [
      "Bug"
    ],
    "__v": 0
  }' 'https://agile-thicket-91714.herokuapp.com/api/v1/pokemon'

**Title**
----
  Delete a pokemon

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/:id

* **Method:**

  `DELETE`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
      `{
        "msg": "Deleted Successfully",
        "pokeInfo": {
          "base": {
            "HP": 60,
            "Attack": 20,
            "Defense": 55,
            "Speed": 30
          },
          "name": {
            "english": "test",
            "japanese": "test",
            "chinese": "test",
            "french": "test"
          },
          "_id": "63433ca66a89a29a280d4910",
          "id": 1000,
          "__v": 0,
          "type": [
            "Bug"
          ]
        }
      }`
 
* **Error Response:**

  * **Reason:** Pokemon not found <br />
    **Content:**
      `{
          "errMsg": "Pokemon not found"
        }`

* **Sample Call:**

  curl -XDELETE 'https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/1000


**Title**
----
  Updating a pokemon or adding one if there isn't a pokemon with the id

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/:id

* **Method:**

  `PUT`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

  `{
    "name": {
      "english": "test",
      "japanese": "test",
      "chinese": "test",
      "french": "test"
    },
    "base": {
      "Sp": {
        " Attack": 25,
        " Defense": 25
      },
      "HP": 60,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30
    },
    
    "id": 1000,
    "type": [
      "Bug"
    ],
    "__v": 0
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
      `{
        "msg": "Updated Successfully",
        "pokeInfo": {
          "id": 1000,
          "name": {
            "english": "test",
            "japanese": "test",
            "chinese": "test",
            "french": "test"
          },
          "base": {
            "HP": 60,
            "Attack": 20,
            "Defense": 55,
            "Speed": 30,
            "Speed Attack": 25,
            "Speed Defense": 25
          },
          "type": [
            "Bug"
          ],
          "__v": 0
        }
      }`
 
* **Error Response:**

  * **Reason:** When using wrong type of input in the body field - "alkfjals" value for HP params <br />
    **Content:** `{ "errMsg": "ValidationError: check to make sure your inputs are correct" }`

* **Sample Call:**

  `curl -XPUT -H "Content-type: application/json" -d '{
        "msg": "Updated Successfully",
        "pokeInfo": {
          "id": 1000,
          "name": {
            "english": "test",
            "japanese": "test",
            "chinese": "test",
            "french": "test"
          },
          "base": {
            "HP": 60,
            "Attack": 20,
            "Defense": 55,
            "Speed": 30,
            "Speed Attack": 25,
            "Speed Defense": 25
          },
          "type": [
            "Bug"
          ],
          "__v": 0
        }
      }' 'https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/1000'`

* **Notes:**

  This PUT request uses upsert. Therefore, if the id of the pokemon is not found, it will add that pokemon in the database.
  This means there won't be a case where an error will occur for when id is not found.


**Title**
----
  Patching a pokemon

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/:id

* **Method:**

  `PATCH`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Data Params**

  `{
    "base": {
      "HP": 66,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "Speed Attack": 25,
      "Speed Defense": 25
    }
  }`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
      `{
        "msg": "Updated Successfully",
        "pokeInfo": {
          "id": "1000",
          "base": {
            "HP": 66,
            "Attack": 20,
            "Defense": 55,
            "Speed": 30,
            "Speed Attack": 25,
            "Speed Defense": 25
          }
        }
      }`

* **Sample Call:**

  `curl -XPATCH -H "Content-type: application/json" -d '{
    "base": {
      "HP": 66,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30,
      "Speed Attack": 25,
      "Speed Defense": 25
    }
  }' 'https://agile-thicket-91714.herokuapp.com/api/v1/pokemon/1000'` 

* **Notes:**

  When running this PATCH request with a unique id, it will create a pokemon with a partial data in the body and the id of your input.


**Title**
----
  Get pokemon image

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/pokemonImage/:id

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
      `{
        "pokemon": "Melmetal",
        "id": 809,
        "image": {
          "URL": "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/809.png"
        }
      }`
 
* **Error Response:**

  * **Reason:** No pokemon image of such id <br />
    **Content:** 
      `{ "errMsg" : "Pokemon image not found" }`

* **Sample Call:**

  `curl -XGET 'https://agile-thicket-91714.herokuapp.com/api/v1/pokemonImage/809'`

* **Notes:**

  Only pokemons from id 1 to 809 have their images available.


**Title**
----
  Accessing improper path

* **URL**

  https://agile-thicket-91714.herokuapp.com/api/v1/*

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
    Any value of `params` that is not `params=[pokemon]` or `params=[pokemons]` or `params=[pokemonImage]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `{
      "msg": "Improper route. Check API docs plz."
    }`

* **Sample Call:**

  https://agile-thicket-91714.herokuapp.com/api/v1/*pokemooooons?count=2&after=10

* **Notes:**

  As this is an "improper" path leading to a message json response, it can be said that the success response is also an error response but for other paths.

## Rest API Doc

---

#### SEEDER

<details>
 <summary><code>POST</code> <code><b>/api/dummy-seed</b></code> <code>(will be seed DB with some dummy data)</code></summary>

##### Auth

> none

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/JSON` | `{"code":"200","message":"Seed successfully"}`   |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

---

#### AUTH

<details>
 <summary><code>POST</code> <code><b>/api/login</b></code> <code>(authenticates user for login depends on credentials)</code></summary>

##### Auth

> none

##### Parameters

> | name       | type       | data type | description |
> | ---------- | ---------- | --------- | ----------- |
> | `userName` | `required` | `string`  | `none`      |
> | `password` | `required` | `string`  | `none`      |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/JSON` | `{"code":"200","data":"{token: string}"}`        |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

---

#### USER

<details>
 <summary><code>POST</code> <code><b>/api/user</b></code> <code>(creates user)</code></summary>

##### Auth

> none

##### Parameters

> none

##### Body JSON

> | name       | type       | data type | description |
> | ---------- | ---------- | --------- | ----------- |
> | `userName` | `required` | `string`  | `none`      |
> | `password` | `required` | `string`  | `none`      |

##### Responses

> | http code | content-type       | response                                               |
> | --------- | ------------------ | ------------------------------------------------------ |
> | `201`     | `application/JSON` | `{"code":"201","message":"User successfully created"}` |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`           |
> | `409`     | `application/JSON` | `{"code":"409","message":"User doesn't exists"}`       |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`       |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/current-user</b></code> <code>(gets current user)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"code":"200","data":"{Object}"}`               |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`         |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/users</b></code> <code>(gets all users)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/json` | `{"code":"200","data":"Array[Object]"}`          |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`         |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
  <summary><code>GET</code> <code><b>/api/user/{id}</b></code> <code>(gets user depends on id)</code></summary>

##### Auth - ADMIN

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name | type       | data type | description                           |
> | ---- | ---------- | --------- | ------------------------------------- |
> | `id` | `required` | `string`  | `The specific user unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{"code":"200","data":"{Object}"}`                      |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `409`     | `application/JSON` | `{"code":"409","message":"User doesn't exists"}`        |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>PUT</code> <code><b>/api/user/{id}</b></code> <code>(updates user depends on id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name | type       | data type | description                           |
> | ---- | ---------- | --------- | ------------------------------------- |
> | `id` | `required` | `string`  | `The specific user unique identifier` |

##### Body JSON

> | name       | type       | data type | description |
> | ---------- | ---------- | --------- | ----------- |
> | `userName` | `required` | `string`  | `none`      |
> | `password` | `required` | `string`  | `none`      |

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Updated"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `409`     | `application/JSON` | `{"code":"409","message":"User doesn't exists"}`        |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>DELETE</code> <code><b>/api/user/{id}</b></code> <code>(removes user from DB depends on id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name | type       | data type | description                           |
> | ---- | ---------- | --------- | ------------------------------------- |
> | `id` | `required` | `string`  | `The specific user unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Deleted"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `403`     | `application/json` | `{"code":"403","message":"Forbidden"}`                  |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

---

#### WATCH LIST

<details>
 <summary><code>POST</code> <code><b>/api/watch-list/{videoId}</b></code> <code>(adds video into user watch list)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name      | type       | data type | description |
> | --------- | ---------- | --------- | ----------- |
> | `videoId` | `required` | `string`  | `none`      |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `201`     | `application/JSON` | `{"code":"201","data":"Video added"}`            |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/watch-list/</b></code> <code>(Shows current user watch list)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/JSON` | `{"code":"200","data":"Array[Object]"}`          |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/api/watch-list/{videoId}</b></code> <code>(Removes video from current user watch list)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name      | type       | data type | description |
> | --------- | ---------- | --------- | ----------- |
> | `videoId` | `required` | `string`  | `none`      |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `204`     | `application/JSON` | `{"code":"204","data":"Removed"}`                |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

---

#### VIDEO

<details>
 <summary><code>POST</code> <code><b>/api/video</b></code> <code>(creates video)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> | name           | type       | data type | description                        |
> | -------------- | ---------- | --------- | ---------------------------------- |
> | `name`         | `required` | `string`  | `custom video name`                |
> | `originalName` | `required` | `string`  | `video uniq hash name for storage` |
> | `originURL`    | `none`     | `string`  | `video URL - YouTube`              |
> | `originPath`   | `none`     | `string`  | `video storage path`               |
> | `description`  | `none`     | `string`  | `video description text`           |
> | `videoLanguage`| `required` | `string`  | `none`                             |
> | `topics`       | `required` | `array`   | `video topics ids`                 |
> | `userId`       | `required` | `number`  | `video author`                     |

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `201`     | `application/JSON` | `{"code":"201","message":"Video successfully created"}` |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`            |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/videos</b></code> <code>(gets paginated videos)</code></summary>

##### Auth

> none

##### Parameters

> | name    | type       | data type | description                |
> | ------- | ---------- | --------- | -------------------------- |
> | `page`  | `required` | `string`  | `Number of page`           |
> | `limit` | `required` | `string`  | `Limit of videos pro page` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{"code":"200","data":"Array[Object]"}`                 |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>GET</code> <code><b>/api/video/{id}</b></code> <code>(gets video depends on id)</code></summary>

##### Auth

> none

##### Parameters

> | name | type       | data type | description                            |
> | ---- | ---------- | --------- | -------------------------------------- |
> | `id` | `required` | `string`  | `The specific video unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{"code":"200","data":"{Object}"}`                      |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>PUT</code> <code><b>/api/video/{id}</b></code> <code>(updates video depends on id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name | type       | data type | description                           |
> | ---- | ---------- | --------- | ------------------------------------- |
> | `id` | `required` | `string`  | `The specific user unique identifier` |

##### Body JSON

> | name           | type       | data type | description              |
> | -------------- | ---------- | --------- | ------------------------ |
> | `name`         | `required` | `string`  | `custom video name`      |
> | `originURL`    | `none`     | `string`  | `video URL - YouTube`    |
> | `originPath`   | `none`     | `string`  | `video storage path`     |
> | `description`  | `none`     | `string`  | `video description text` |
> | `videLanguage` | `required` | `string`  | `none`                   |
> | `topics`       | `required` | `array`   | `video topics ids`       |

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Updated"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>DELETE</code> <code><b>/api/video/{id}</b></code> <code>(hard video deletes depends on id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name | type       | data type | description                            |
> | ---- | ---------- | --------- | -------------------------------------- |
> | `id` | `required` | `string`  | `The specific video unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Deleted"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

---

#### URL_DOCUMENT

<details>
 <summary><code>POST</code> <code><b>/api/url-document</b></code> <code>(creates url document)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> | name      | type       | data type | description                         |
> | --------- | ---------- | --------- | ----------------------------------- |
> | `name`    | `required` | `string`  | `custom video name`                 |
> | `urlLink` | `required` | `string`  | `web link to document or something` |
> | `videoId` | `required` | `string`  | `none`                              |

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `201`     | `application/JSON` | `{"code":"201","message":"Video successfully created"}` |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`            |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/url-documents</b></code> <code>(gets all url documents )</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{"code":"200","data":"Array[Object]"}`                 |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>GET</code> <code><b>/api/url-document/{videoId}</b></code> <code>(gets url-document depends on vide id)</code></summary>

##### Auth

> none

##### Parameters

> | name      | type       | data type | description                            |
> | --------- | ---------- | --------- | -------------------------------------- |
> | `videoId` | `required` | `string`  | `The specific video unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `200`     | `application/json` | `{"code":"200","data":"{Object}"}`                      |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>PUT</code> <code><b>/api/url-document/{videoId}</b></code> <code>(updates url document  depends on video id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name      | type       | data type | description                            |
> | --------- | ---------- | --------- | -------------------------------------- |
> | `videoId` | `required` | `string`  | `The specific video unique identifier` |

##### Body JSON

> | name      | type       | data type | description                         |
> | --------- | ---------- | --------- | ----------------------------------- |
> | `name`    | `required` | `string`  | `custom video name`                 |
> | `urlLink` | `required` | `string`  | `web link to document or something` |

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Updated"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

<details>
  <summary><code>DELETE</code> <code><b>/api/url-video/{id}</b></code> <code>(hard url document deletes depends on video id)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name      | type       | data type | description                            |
> | --------- | ---------- | --------- | -------------------------------------- |
> | `videoId` | `required` | `string`  | `The specific video unique identifier` |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                                |
> | --------- | ------------------ | ------------------------------------------------------- |
> | `204`     | `application/json` | `{"code":"204","data":"Deleted"}`                       |
> | `400`     | `application/json` | `{"code":"400","message":"Bad Request"}`                |
> | `422`     | `application/json` | `{"code":"422","message":"Missing or wrong parameter"}` |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}`        |

</details>

---

#### TOPIC

<details>
 <summary><code>POST</code> <code><b>/api/topic/</b></code> <code>(creates new topic)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> | name    | type       | data type | description                        |
> | ------- | ---------- | --------- | ---------------------------------- |
> | `name`  | `required` | `string`  | `custom topic name`                |
> | `color` | `required` | `string`  | `topic custom color in HEX format` |

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `201`     | `application/JSON` | `{"code":"201","data":"Topic created"}`          |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
 <summary><code>GET</code> <code><b>/api/topics/</b></code> <code>(Gets all topics)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> none

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `200`     | `application/JSON` | `{"code":"200","data":"Array[Object]"}`          |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/api/topic/{topicId}</b></code> <code>(Removes video from current user watch list)</code></summary>

##### Auth

> | name    | type       | data type | description |
> | ------- | ---------- | --------- | ----------- |
> | `token` | `required` | `string`  | `JWT Token` |

##### Parameters

> | name      | type       | data type | description |
> | --------- | ---------- | --------- | ----------- |
> | `topicId` | `required` | `string`  | `none`      |

##### Body JSON

> none

##### Responses

> | http code | content-type       | response                                         |
> | --------- | ------------------ | ------------------------------------------------ |
> | `204`     | `application/JSON` | `{"code":"204","data":"Removed"}`                |
> | `400`     | `application/JSON` | `{"code":"400","message":"Invalid request"}`     |
> | `401`     | `application/JSON` | `{"code":"401","message":"Unauthorized"}`        |
> | `500`     | `application/JSON` | `{"code":"500","message":"You shall not pass!"}` |

</details>

---

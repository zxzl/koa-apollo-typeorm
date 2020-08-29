https://dbdiagram.io/

```
Table users as U {
  id int [pk, increment] // auto-increment
  firstName varchar
  lastName varchar
  email email
}

Table posts as P {
  id int [pk, increment] 
  userId varchar
  created_at timestamp
  updated_at timestamp
  body varchar
 }
 
Table photos {
  id int [pk, increment] 
  url varchar
  postId int
  created_at timestamp
}

Table comments {
  id int [pk, increment] 
  body varchar
  userId int
  postId int
  parentId int
  created_at timestamp
  updated_at timestamp
}

Table post_likes_user {
  userId int
  postId int
}
 

// Creating references
// You can also define relaionship separately
// > many-to-one; < one-to-many; - one-to-one
Ref: posts.userId > U.id
Ref: photos.postId > P.id

Ref: comments.userId > U.id
Ref: comments.postId > P.id
Ref: comments.parentId > comments.id

Ref: post_likes_user.userId > U.id
Ref: post_likes_user.postId > P.id
```

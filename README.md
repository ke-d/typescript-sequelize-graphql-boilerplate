## Running Locally

### Prereq Software

Make sure you have [Node.js 10](http://nodejs.org/).

### Database

1. https://www.elephantsql.com
2. Sign up using GitHub and make a free PostgreSQL DB
3. Copy the URL link from the details tab into the .env variable below

### Env Variables

1. Create a file named `.env`
2. Enter these variables in the file, replacing the `<blah>` with actual values

```
DATABASE_URL=postgres://<username>:<password>@<url>
CRYPTO_KEY=THISISASECRET
```

```
$ npm install
$ npm run dev
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

Go to [/graphql](http://localhost:5000/graphql)

## Creating a new Model for Sequalize/GraphQL

```
User.ts
...............................
  @Column // A column in the database
  public githubId!: string;

  @Field({ description: 'Username of the user' }) // Expose this variable to GraphQL
  @Column // A column in the database
  public username!: string;

  @Field({ description: 'The base value of their scores without any bonuses' }) // Expose this variable to GraphQL
  @Column // A column in the database
  public baseScore!: number;
...............................
```

So the convention (in this case), the top decorator is going to be the `@Field` if we are going to be exposing that variable to GraphQL.

The bottom decorator `@Column` is used for Sequalize, so it knows that variable should be a column in the DB.

TLDR:

[Top Decorator: GraphQL](https://19majkel94.github.io/type-graphql/docs/getting-started.html)

[Bottom Decorator: Sequalize](https://www.npmjs.com/package/sequelize-typescript#model-definition)

These libraries were the only ones I found interacted well with each other with TypeScript.

## Making a GraphQL Resolver (aka a controller)

```
@Resolver(User)
export default class UserResolver {
  @Query((returns) => User)
  public async user(@Arg('username') username: string) {
    const user = await User.find({
      where: { username },
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
```

[Refer to these docs for making the resolver part](https://19majkel94.github.io/type-graphql/docs/resolvers.html)

[Refer to these docs for interacting with the DB with Sequalize](http://docs.sequelizejs.com/)

Btw, ignore how they make their models as we have a custom way from above.

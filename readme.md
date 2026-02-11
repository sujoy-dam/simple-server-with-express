<!-- install process -->
npm init -y
<!-- delete "type": "commonjs" -->
npm install express --save
npm i -D typescript
npx tsc --init

npm i -D tsx

npx tsx example.ts
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev":"npx tsx watch ./src/server.ts"
},

I have to use to get 'post" data by a middleware. Name
-app.use(express.json()) 

if i want to get form data use
app.use(express.urlencoded());
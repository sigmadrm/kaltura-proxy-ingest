import start from './App';
start().then((port: number) => {
  console.log(`Server listening at port ${port}`);
});
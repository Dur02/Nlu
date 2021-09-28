export default (router) => {
  router.delete('/api/auth/local', (request, response) => {
    response.status(204).send();
  });
};

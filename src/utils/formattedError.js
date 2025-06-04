const formatZodError = (zodError) =>
  zodError.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));

module.exports = { formatZodError };

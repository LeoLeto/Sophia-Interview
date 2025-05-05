export const getGenderedGreeting = (name: string | undefined) => {
  if (!name) return "Bienvenido";

  const isFemale = name.toLowerCase().endsWith("a");
  return isFemale ? `Bienvenida, ${name}` : `Bienvenido, ${name}`;
};


import { technologies } from "../data/technologies.js";

function parseSearchParams(search) {
  const query = String(search ?? "").split("#", 1)[0];

  return new URLSearchParams(query);
}

function isKnownTechnology(technologyId) {
  return (
    typeof technologyId === "string" &&
    Object.hasOwn(technologies, technologyId)
  );
}

export function getTechnologyFilter(search) {
  const params = parseSearchParams(search);
  const technologyId = params.get("tech");

  if (!isKnownTechnology(technologyId)) {
    return null;
  }

  return technologyId;
}

export function filterProjectsByTechnology(
  projects,
  technologyId,
) {
  if (!technologyId) {
    return projects;
  }

  if (!isKnownTechnology(technologyId)) {
    return [];
  }

  return projects.filter((project) =>
    project.technologies?.includes(technologyId),
  );
}

export function hasProjectsForTechnology(
  projects,
  technologyId,
) {
  if (!isKnownTechnology(technologyId)) {
    return false;
  }

  return projects.some((project) =>
    project.technologies?.includes(technologyId),
  );
}

export function clearTechnologyFilter(search) {
  const params = parseSearchParams(search);

  params.delete("tech");

  const remainingQuery = params.toString();

  return remainingQuery
    ? `?${remainingQuery}`
    : "";
}

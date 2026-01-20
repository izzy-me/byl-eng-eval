"use server";

import { getRoleById } from "@/lib/data/roles";
import { Role, RoleId, isRoleId } from "@/lib/types";

export type GetRoleSuccess = {
  ok: true;
  roleId: RoleId;
  role: Role;
};

export type GetRoleError = {
  ok: false;
  error: string;
};

export type GetRoleResponse =
  | GetRoleSuccess
  | GetRoleError;

export default async function getUserResultsAction(
  roleId?: string
): Promise<GetRoleResponse> {
  if (!roleId || !isRoleId(roleId)) {
    return { ok: false, error: "Missing or invalid role" };
  }

  const role = getRoleById(roleId);

  if (!role) {
    return { ok: false, error: "Role not found" };
  }

  return { ok: true, roleId: role.id, role};
}

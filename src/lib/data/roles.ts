import raw from "@/data/roles.json";
import { Role, RoleId } from "@/lib/types";


//redefined const ROLES because there was a mismatch between this and the JSON keys
const ROLES: Role[] = (raw as any[]).map((r) => ({
  id: r.id,
  name: r.name,
  role_desc: r.role_desc,
  core_drive: r.core_drive,
  most_like_when: r.most_like_when,
  high_rank_desc: r.core_rank_desc,
  low_rank_desc: r.peripheral_rank_desc,
  top_rank_desc: r.top_rank_desc,
  bottom_rank_desc: r.bottom_rank_desc,
}));

export function getAllRoles(): Role[] {
  return ROLES;
}

export function getRoleById(roleId: RoleId): Role | null {
  return ROLES.find((role) => role.id === roleId) ?? null;
}

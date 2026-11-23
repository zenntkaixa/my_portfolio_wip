/** A role as a neutral outlined pill with a decorative dot in the role's colour (--role-* tokens). */
export function RolePill({ role }: { role: string }) {
  return (
    <span className="pill">
      <span className="role-dot" data-role={role} aria-hidden="true" />
      {role}
    </span>
  );
}

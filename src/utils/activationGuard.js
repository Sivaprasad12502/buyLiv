export const requireActivation = (profile, navigate) => {
  if (!profile?.is_activated) {
    navigate("/joining-packages");
    return false;
  }
  return true;
};

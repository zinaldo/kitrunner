/** Friendly PT messages for common Supabase Auth errors. */
export function mapAuthErrorToPt(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (m.includes("email not confirmed")) {
    return "Confirme seu e-mail (link enviado pela caixa de entrada) antes de entrar.";
  }
  if (m.includes("user already registered")) {
    return "Este e-mail já está cadastrado. Entre com sua senha ou use recuperação de senha no Supabase.";
  }
  if (m.includes("password should be at least")) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }
  if (m.includes("signup_disabled") || m.includes("signups not allowed")) {
    return "Novos cadastros estão desativados no projeto. Peça a um administrador.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Falha de rede. Verifique sua conexão e tente de novo.";
  }
  return message;
}

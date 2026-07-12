const supabase = require("../config/supabase");

const logAudit = async ({
  user,
  action,
  module,
  targetId = null,
  targetName = null,
  description = null,
  req,
}) => {
  try {
    const { error } = await supabase
      .from("audit_logs")
      .insert([
        {
          user_id: user?.id || null,
          user_name: user?.name || null,
          user_email: user?.email || null,

          action,
          module,

          target_id: targetId,
          target_name: targetName,

          description,

          ip_address: req?.ip || null,
          user_agent: req?.headers["user-agent"] || null,
        },
      ]);

    if (error) {
      console.error("Audit Log Error:", error.message);
    }
  } catch (error) {
    console.error("Audit Service Error:", error.message);
  }
};

module.exports = {
  logAudit,
};
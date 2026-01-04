export const initSocket = (io) => {
  io.on("connection", (socket) => {
    // Profesorul intră în camera activității folosind ID-ul numeric
    socket.on("join_activity", (activityId) => {
      socket.join(`activity_${activityId}`);
    });

    socket.on("send_feedback_instant", (payload) => {
    // DOAR emitem către profesor, fără Prisma!
    io.to(`activity_${payload.activityId}`).emit("new_feedback", payload);
});
  });
};

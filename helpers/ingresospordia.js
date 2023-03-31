

const ingresosDia = (ingresos) => {

    const registrosPorDia = ingresos.reduce((acc, registro) => {
        const fecha = new Date(registro.fecha);
        const dia = fecha.getDay();

        if (!acc[dia]) {
          acc[dia] = [];
        }
        acc[dia].push(registro);
        return acc;
        
      }, {});

      for (const dia in registrosPorDia) {
        registrosPorDia[dia].sort((a, b) => {
          const fechaA = new Date(a.fecha);
          const fechaB = new Date(b.fecha);
          return fechaA.getTime() - fechaB.getTime();
        });
      }

      let arrayIngresos = [];

      for( i = 0; i<= 6; i++){
        if(!registrosPorDia[i]?.length){
          arrayIngresos[i] = 0;
        } else {
          arrayIngresos[i] = registrosPorDia[i].length;
        }
      }

      console.log(arrayIngresos);


      const jsonPorDia = [
        { dia: "Lunes", ingresosDia : arrayIngresos[1], registros: registrosPorDia[1] || [] },
        { dia: "Martes", ingresosDia : arrayIngresos[2], registros: registrosPorDia[2] || [] },
        { dia: "Miércoles", ingresosDia : arrayIngresos[3], registros: registrosPorDia[3] || [] },
        { dia: "Jueves", ingresosDia : arrayIngresos[4], registros: registrosPorDia[4] || [] },
        { dia: "Viernes", ingresosDia : arrayIngresos[5], registros: registrosPorDia[5] || [] },
        { dia: "Sábado", ingresosDia : arrayIngresos[6], registros: registrosPorDia[6] || [] },
        { dia: "Domingo", ingresosDia : arrayIngresos[0], registros: registrosPorDia[0] || [] }
      ];

    return jsonPorDia;
}



module.exports = {
    ingresosDia
}
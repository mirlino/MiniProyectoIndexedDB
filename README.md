# Proyecto de aprendizaje con IndexedDB
![Preview](https://raw.githubusercontent.com/mirlino/MiniProyectoIndexedDB/master/img/preview.PNG "Vista Previa Mini Agenda")

*Sobre el proyecto*:

Con el motivo de adquirir conocimiento nuevo, he creado una pequeña aplicación parecida a una agenda que sirve para guardar registros de actividades personales utilizando la API de IndexedDB como almacenador del registro la cual cuenta con lo siguiente:

1. **Fecha y hora de la actividad:**
   * Podrás ver tanto la fecha actual como la hora en formato 12h al presionar el botón *actualizar*.
  

2. **Actividad:**
      * En actividad podrás colocar el titulo de tu actividad a registrar.


3. **Observación:**
     * Escribe una descripción de tu actividad que quieres guardar para acordarte de que trataba.


4. **Botón *Enviar datos*:**
   * Este botón sirve para guardar los datos una vez aplicados en sistema, *Ojo que es necesario que todos los campos estén llenos para poder guardar la información*.


5. **Botón *Borrar el registro completo*:**
    * Este botón sirve para borrar todo el registro guardado anteriormente en la base de registros *Ojo que si eliminas todos los registros no podrás volver a recuperarlos*.

___
## Luego de haber guadado una data veras lo siguiente:

![Preview](img/https://raw.githubusercontent.com/mirlino/MiniProyectoIndexedDB/master/img/preview_two.PNG "Vista Previa Al guardar un registro.")

Como se puede apreciar podrás ver una tabla que muestra un ID, Hora, actividad, Observación, Duración, Modificar y Borrar, cada una tiene la información necesaria del mismo, pero se dará una breve descripción del significado de cada elemento a continuación:

1. **ID:**
   * Muestra le número de registro *(un autoIncrement)* que se le a asignado automáticamente al guardar dicha información en el registro.


2. **Hora:**
   * Muestra la fecha y la hora en la que fue registrada la actividad.


3. **Actividad:**
   * Muestra el título de la actividad con la que se guardó.


4. **Observación:**
   * Muestra una descripción de la actividad en cuestión.


5. **Duración:**
   * Muestra el estatus de la actividad la cual posee dos momentos en el tiempo:
     * *En curso:* Se muestra cuando es la ultima actividad guardada, ya que el sistema interpretara que el ultimo registro guardado es una actividad que esta en aun sin finalizar.
  
     * *Horario:* Al guardar otro registro el cual pasara a ser el ultimo el registro que decía *En curso* pasara a tener el tiempo en que duro en proceso antes de agregar otro registro.


6. **Modificar:**
   * Botón el cual sirve para modificar *la Observación y el título de ser necesario*, si cambia la hora el registro será guardado como un registro nuevo.


7. **Borrar:**
   * Botón el cual sirve para eliminar el registro en cuestión.

___

Esta aplicación esta realizada utilizando las Tecnologías de HTML y JavaScript, se continuara dando soporte de mejora continua a la misma para darle mas funciones y mejor vista a futuro.

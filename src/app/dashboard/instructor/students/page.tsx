"use client";
import React, { useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dateFormat = 'DD/MM/YYYY';

const Students = () => {
  const currentDate = dayjs();

  return (
    <section>
      <DatePicker 
        defaultValue={currentDate} 
        format={dateFormat}
      />
    </section>
  );
};

export default Students;

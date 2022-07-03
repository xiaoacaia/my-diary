import React, { forwardRef, useState } from 'react'
import { DatePicker } from 'antd-mobile'
import dayjs from 'dayjs'

export default forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [visible, setVisivle] = useState(false)

  const choseMonth = (item) => {
    setVisivle(false)
    if (mode == 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode == 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  if (ref) {
    ref.current = {
      visible: () => {
        setVisivle(true)
      },
      close: () => {
        setVisivle(false)
      }
    }
  };

  return <DatePicker
    title='时间选择'
    visible={visible}
    onMaskClick={() => setVisivle(false)}
    onClose={() => {
      setVisivle(false)
    }}
    onConfirm={choseMonth}
  />
});


import { Amount } from '@alfalab/core-components/amount';
import { BottomSheet } from '@alfalab/core-components/bottom-sheet';
import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { Gap } from '@alfalab/core-components/gap';
import { SuperEllipse } from '@alfalab/core-components/icon-view/super-ellipse';
import { NumberInput } from '@alfalab/core-components/number-input';
import { PureCell } from '@alfalab/core-components/pure-cell';
import { Radio } from '@alfalab/core-components/radio';
import { Status } from '@alfalab/core-components/status';
import { Typography } from '@alfalab/core-components/typography';
import { ArrowRightMIcon } from '@alfalab/icons-glyph/ArrowRightMIcon';
import { InformationCircleLineSIcon } from '@alfalab/icons-glyph/InformationCircleLineSIcon';
import { InformationCircleSIcon } from '@alfalab/icons-glyph/InformationCircleSIcon';
import { Fragment, useState } from 'react';
import rubIcon from '../assets/rub.png';
import { STOCK_WORDS } from '../constants';
import { LS, LSKeys } from '../ls';
import { BotItem, StockItem } from '../types';
import { sendDataToGA } from '../utils/events';
import { formatWord } from '../utils/words';
import { bsSt } from './style.css';

type Props = {
  stockItem: StockItem;
  bot: BotItem;
  setThx: (v: boolean) => void;
};

export const BuyScreen = ({ stockItem, bot, setThx }: Props) => {
  const [lots, setLots] = useState(0);
  const [showBs, setShowBs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [botConnected, setBotConnected] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showBotInfo, setShowBotInfo] = useState(false);

  const submit = () => {
    if (lots === 0) {
      return;
    }
    setLoading(true);
    sendDataToGA({
      sum: stockItem.price_today * lots * stockItem.lot,
      ticker: stockItem.ticker,
      bot: botConnected ? bot.name : 'none',
      risk: botConnected && selectedLevel ? bot.riskLevels[Number(selectedLevel)].level : 'none',
    }).then(() => {
      LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
      setLoading(false);
    });
  };

  return (
    <>
      <div className={bsSt.container}>
        <Gap size={8} />
        <Typography.TitleMobile tag="h1" view="medium" font="system" weight="bold">
          Покупка
        </Typography.TitleMobile>

        <div className={bsSt.banner} style={{ marginTop: '12px' }}>
          <img src={stockItem.img} width={48} height={48} className={bsSt.bannerImg} alt={stockItem.name} />

          <div className={bsSt.columnText}>
            <Typography.Text view="component-primary">{stockItem.name}</Typography.Text>
            <Typography.Text view="primary-small" color="secondary">
              {stockItem.ticker}
            </Typography.Text>
          </div>

          {stockItem && (
            <div className={bsSt.columnText} style={{ marginLeft: 'auto', alignItems: 'flex-end' }}>
              <Amount
                value={stockItem.price_today * 100}
                minority={100}
                currency="RUB"
                view="withZeroMinorPart"
                transparentMinor={false}
                bold="major"
              />
              <Typography.Text view="primary-small" color="secondary">
                За акцию
              </Typography.Text>
            </div>
          )}
        </div>

        <div style={{ marginTop: '12px' }}>
          <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
            Счёт списания
          </Typography.Text>

          <div className={bsSt.bannerAccount}>
            <img src={rubIcon} width={48} height={48} alt="rubIcon" />

            <Typography.Text view="primary-small" weight="medium">
              Текущий счёт
            </Typography.Text>
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <NumberInput
            value={lots}
            onChange={(_, { value }) => setLots(value ?? 1)}
            step={1}
            min={0}
            max={999}
            block
            label="Лоты"
            labelView="outer"
            size={48}
            hint={`1 лот = ${formatWord(stockItem.lot, STOCK_WORDS)}`}
            pattern="[0-9]*"
          />
        </div>

        <div className={bsSt.botContainer({ connected: botConnected })}>
          {botConnected && (
            <div>
              <Status view="contrast" color="green" size={20}>
                <Typography.Text view="secondary-small" weight="bold">
                  Подключено
                </Typography.Text>
              </Status>
            </div>
          )}
          <div>
            <div className={bsSt.row} onClick={() => setShowBotInfo(true)} style={{ cursor: 'pointer' }}>
              <Typography.TitleMobile tag="h4" view="xsmall" font="system" weight="semibold">
                {bot.name}
              </Typography.TitleMobile>
              <InformationCircleSIcon width={14} height={14} color="#B8B9C0" />
            </div>
            <Typography.Text view="primary-small" tag="p" defaultMargins={false} color="secondary">
              {bot.description}
            </Typography.Text>
          </div>

          <ButtonMobile
            view="secondary"
            size={32}
            onClick={() => {
              if (botConnected) {
                setBotConnected(false);
              } else {
                window.gtag('event', '6332_bot_activate', { ticker: stockItem.ticker, var: 'var4', bot: bot.name });
                setShowLevels(true);
              }
            }}
          >
            {botConnected ? 'Отключить' : 'Подключить'}
          </ButtonMobile>
        </div>
      </div>
      <Gap size={128} />
      <div className={bsSt.bottomBtn}>
        <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
          Итого
        </Typography.Text>
        <div className={bsSt.row}>
          <div>
            <Typography.TitleResponsive
              view="medium"
              tag="h3"
              font="system"
              weight="semibold"
              color={lots > 0 ? 'primary' : 'disabled'}
            >
              {(stockItem.price_today * lots * stockItem.lot).toLocaleString('ru')}&nbsp;
              <span style={{ fontWeight: 400 }}>₽</span>
            </Typography.TitleResponsive>
            <div className={bsSt.rowSmall} onClick={() => setShowBs(true)}>
              <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
                Без комиссии
              </Typography.Text>
              <InformationCircleLineSIcon color="#0404138C" />
            </div>
          </div>
          <ButtonMobile view="text" onClick={submit} loading={loading}>
            <SuperEllipse backgroundColor="#0F0F0F" size={48}>
              <ArrowRightMIcon color="#FFFFFF" />
            </SuperEllipse>
          </ButtonMobile>
        </div>
      </div>

      <BottomSheet
        open={showLevels}
        onClose={() => {
          setShowLevels(false);
        }}
        contentClassName={bsSt.btmContent}
        title={
          <Typography.Text view="primary-large" tag="p" defaultMargins={false} weight="medium">
            Выберите уровень риска для подключения робота
          </Typography.Text>
        }
        hasCloser
        stickyHeader
        actionButton={
          <ButtonMobile
            view="primary"
            size={56}
            block
            onClick={() => {
              if (selectedLevel) {
                setBotConnected(true);
              }
              setShowLevels(false);
            }}
          >
            Выбрать и подключить
          </ButtonMobile>
        }
      >
        <div className={bsSt.container}>
          {bot.riskLevels.map((levelData, index) => (
            <PureCell className={bsSt.rowLevel} key={levelData.level} onClick={() => setSelectedLevel(String(index))}>
              <PureCell.Content>
                <PureCell.Main>
                  <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
                    {levelData.level}
                  </Typography.Text>
                  <Typography.Text view="secondary-small" tag="p" defaultMargins={false} color="secondary">
                    {levelData.profit}
                  </Typography.Text>
                </PureCell.Main>
              </PureCell.Content>
              <PureCell.Addon verticalAlign="center">
                <Radio checked={selectedLevel === String(index)} onChange={() => setSelectedLevel(String(index))} />
              </PureCell.Addon>
            </PureCell>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet
        open={showBs}
        onClose={() => {
          setShowBs(false);
        }}
        contentClassName={bsSt.btmContent}
        title="Покупка акций и комиссия"
        hasCloser
        stickyHeader
      >
        <div className={bsSt.container}>
          <Typography.TitleResponsive style={{ marginTop: '12px' }} font="system" tag="h2" view="xsmall" weight="semibold">
            Покупка
          </Typography.TitleResponsive>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            Акции на бирже торгуются в лотах. Лот — это комплект ценных бумаг, который можно купить за раз. Рядом с полем для
            ввода суммы есть подсказка о том, сколько акций в одном лоте.
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            Вы можете оставить заявку на покупку акций. Для этого выберите количество лотов или сумму, которую хотите
            потратить — брокер расчитает доступное количество лотов и купит ценную бумагу по рыночной цене. Это самый быстрый
            способ совершить сделку.
          </Typography.Text>
          <Typography.TitleResponsive style={{ marginTop: '12px' }} font="system" tag="h2" view="xsmall" weight="semibold">
            Цена
          </Typography.TitleResponsive>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            Цена облигации зависит от спроса и предложения. В момент покупки она может измениться в пределах 5%
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            Вы покупаете по рыночной цене. Выберите количество лотов или сумму, которую хотите потратить — мы рассчитаем
            доступное количество лотов и купим ценную бумагу по рыночной цене. Это удобно, если сделку нужно совершить
            быстро.
          </Typography.Text>
          <Typography.TitleResponsive style={{ marginTop: '12px' }} font="system" tag="h2" view="xsmall" weight="semibold">
            Комиссия
          </Typography.TitleResponsive>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            Комиссия зависит от вашего тарифа. Подробнее узнать о тарифах вы можете в разделе Инвестиции. Проверить или
            сменить ваш тариф можно в приложении Альфа-Инвестиции: Ещё → Личный кабинет → Тарифы
          </Typography.Text>
        </div>
      </BottomSheet>

      <BottomSheet
        open={showBotInfo}
        onClose={() => {
          setShowBotInfo(false);
        }}
        contentClassName={bsSt.btmContent}
        title={`Как работает стратегия торгового робота «${bot.name}»`}
        hasCloser
        stickyHeader
        actionButton={
          <ButtonMobile
            view="primary"
            block
            onClick={() => {
              setShowBotInfo(false);
            }}
          >
            Понятно
          </ButtonMobile>
        }
      >
        <div className={bsSt.container}>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            {bot.text1}
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false} weight="bold">
            Как это работает
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            {bot.text2.split('\n').map((line, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </Typography.Text>
          <div className={bsSt.box}>
            <Typography.Text view="primary-medium" tag="p" defaultMargins={false} weight="bold">
              Пример
            </Typography.Text>
            <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
              {bot.text3.split('\n').map((line, index) => (
                <Fragment key={index}>
                  {line}
                  <br />
                </Fragment>
              ))}
            </Typography.Text>
          </div>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false} weight="bold">
            Метрики
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            {bot.text4.split('\n').map((line, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false} weight="bold">
            Что ещё важно знать
          </Typography.Text>
          <Typography.Text view="primary-medium" tag="p" defaultMargins={false}>
            {bot.text5.split('\n').map((line, index) => (
              <Fragment key={index}>
                {line}
                <br />
              </Fragment>
            ))}
          </Typography.Text>
        </div>
      </BottomSheet>
    </>
  );
};
